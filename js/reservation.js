document.addEventListener('DOMContentLoaded', function() {
    const stationsTableBody = document.getElementById('stations-table-body');
    const liensTableBody = document.getElementById('liens-table-body');
    const sourceSelect = document.getElementById('source_station');
    const destinationSelect = document.getElementById('destination_station');
    const bookingForm = document.getElementById('booking-form');
    const resultZone = document.getElementById('result-zone');
    const refreshBtn = document.getElementById('refresh-btn');

    const zoomInBtn = document.getElementById('zoom-in-btn');
    const zoomOutBtn = document.getElementById('zoom-out-btn');
    const fitBtn = document.getElementById('fit-btn');
    
    let network = null;

    // The custom color palette has been removed.

    function createCapacityBar(used, total) {
        if (total === 0) return '<div class="capacity-bar"><div class="low" style="width: 100%;">N/A</div></div>';
        const percentageUsed = (used / total) * 100;
        let colorClass = 'high';
        if (percentageUsed >= 80) colorClass = 'low';
        else if (percentageUsed >= 50) colorClass = 'medium';

        return `
            <div class="capacity-bar" title="${percentageUsed.toFixed(1)}% Utilisé">
                <div class="${colorClass}" style="width: ${percentageUsed.toFixed(2)}%;">
                    ${percentageUsed.toFixed(0)}%
                </div>
            </div>
        `;
    }

    // ===================================================================
    // FONCTION MISE À JOUR : Dessiner le diagramme avec couleurs de nœuds uniformes
    // ===================================================================

    // assume `network` is a global variable
function drawNetworkDiagram(stations, liens) {
    // CSS: ensure container has explicit height
    // #network-diagram { width: 100%; height: 600px; }

    // Build node+edge arrays (no x/y so physics can compute positions)
    const nodesArray = stations.map(station => {
        const available = station.capacite_totale_cartes - station.capacite_utilisee_cartes;
        return {
            id: station.id,
            label: station.nom,
            // no explicit x/y so vis can compute layout
            size: 20, // target size (will animate from smaller)
            color: {
                background: '#D2E5FF',
                border: '#2B7CE9',
                highlight: { background: '#D2E5FF', border: '#2B7CE9' }
            },
            title: `${station.nom}\nCapacité Cartes Dispo: ${available.toFixed(2)} Gbps`
        };
    });

    const edgesArray = liens.map(lien => {
        const used = lien.capacite_utilisee;
        const total = lien.capacite_totale;
        const available = total - used;
        const percentageUsed = total > 0 ? (used / total) * 100 : 0;

        let color = '#28a745';
        if (percentageUsed >= 80) color = '#dc3545';
        else if (percentageUsed >= 50) color = '#ffc107';

        const finalWidth = 3 + (percentageUsed / 20);
        return {
            id: lien.id, // ensure unique id
            from: lien.station_depart_id,
            to: lien.station_arrivee_id,
            label: `${available.toFixed(0)}G Dispo`,
            font: { background: 'white', size: 12, strokeWidth: 0 },
            title: `Lien: ${lien.nom_depart} ➔ ${lien.nom_arrivee}\nUtilisé: ${used.toFixed(2)} / ${total} Gbps\nDisponible: ${available.toFixed(2)} Gbps`,
            color: { color: color, highlight: '#007bff', hover: '#007bff' },
            width: finalWidth, // target width (we'll animate from 0)
            _finalWidth: finalWidth // keep target for animation
        };
    });

    const container = document.getElementById('network-diagram');

    // Use DataSet so we can update during animation
    const nodesDS = new vis.DataSet(nodesArray);
    const edgesDS = new vis.DataSet(edgesArray);

    const data = { nodes: nodesDS, edges: edgesDS };

    const options = {
        nodes: {
            shape: 'dot',
            size: 20,
            font: { size: 14, color: '#333', face: 'Arial' },
            borderWidth: 2,
            shadow: true
        },
        edges: {
            shadow: false,
            smooth: { type: 'continuous', roundness: 0.2 }
        },
        physics: {
            stabilization: {
                enabled: true,
                iterations: 500,
                updateInterval: 25
            },
            barnesHut: {
                gravitationalConstant: -8000,
                springConstant: 0.04,
                springLength: 200
            }
        },
        interaction: {
            hover: true,
            tooltipDelay: 100,
            zoomView: true
        }
    };

    // helper: perform fit safely
    const applyFit = () => {
        requestAnimationFrame(() => {
            try {
                network.redraw && network.redraw();
                network.fit && network.fit();
            } catch (e) { /* ignore */ }
        });
    };

    // Animation routine: called after stabilization to animate from collapsed -> layout
    const animateLoad = (duration = 1200) => {
        // collect final positions (already computed by stabilization)
        const finalPositions = network.getPositions(); // { id: {x, y}, ... }
        const nodeIds = Object.keys(finalPositions);
        if (nodeIds.length === 0) return;

        // compute centroid of final layout
        let cx = 0, cy = 0;
        nodeIds.forEach(id => {
            cx += finalPositions[id].x;
            cy += finalPositions[id].y;
        });
        cx /= nodeIds.length;
        cy /= nodeIds.length;

        // Store targets and initial states
        const targets = {};
        nodeIds.forEach(id => {
            const node = nodesDS.get(id);
            targets[id] = {
                x: finalPositions[id].x,
                y: finalPositions[id].y,
                size: (node && node.size) ? node.size : (options.nodes.size || 20)
            };
        });

        // Disable physics so we control nodes positions during animation
        network.setOptions({ physics: false });

        // Collapse nodes to centroid and set them small and fixed
        const COLLAPSED_SIZE = 6;
        nodeIds.forEach(id => {
            nodesDS.update({ id: id, x: cx, y: cy, size: COLLAPSED_SIZE, fixed: { x: true, y: true } });
        });
        // collapse edges visually to width 0
        edgesDS.forEach(edge => {
            edgesDS.update({ id: edge.id, width: 0 });
        });

        // allow a short repaint
        setTimeout(() => {
            const start = performance.now();
            const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

            function step(now) {
                const tRaw = Math.min(1, (now - start) / duration);
                const t = easeOutCubic(tRaw);

                // move each node
                nodeIds.forEach(id => {
                    const target = targets[id];
                    const x = cx + (target.x - cx) * t;
                    const y = cy + (target.y - cy) * t;
                    network.moveNode(id, x, y); // moves node position
                    // animate size
                    const size = COLLAPSED_SIZE + (target.size - COLLAPSED_SIZE) * t;
                    nodesDS.update({ id: id, size: size });
                });

                // animate edges width
                edgesDS.forEach(edge => {
                    const finalW = edge._finalWidth || edge.width || 3;
                    const w = finalW * t;
                    edgesDS.update({ id: edge.id, width: w });
                });

                if (tRaw < 1) {
                    requestAnimationFrame(step);
                } else {
                    // finalize: set exact target positions/sizes and unfix nodes
                    nodeIds.forEach(id => {
                        nodesDS.update({ id: id, x: targets[id].x, y: targets[id].y, size: targets[id].size, fixed: { x: false, y: false } });
                    });
                    edgesDS.forEach(edge => {
                        edgesDS.update({ id: edge.id, width: edge._finalWidth || edge.width || 3 });
                    });
                    applyFit(); // ensure viewport fits final layout
                }
            }

            requestAnimationFrame(step);
        }, 20);
    };

    if (network) {
        // if already instantiated, update data and animate
        network.setData(data);
        // small delay to ensure the network updates, then stabilize & animate
        // Use stabilization flow to get final positions: run a short stabilization cycle
        network.once('stabilizationIterationsDone', () => {
            setTimeout(() => animateLoad(), 30);
        });
        // re-enable stabilization briefly to let it compute positions for animation
        network.setOptions({
            physics: {
                stabilization: { enabled: true, iterations: 200, updateInterval: 25 },
                barnesHut: options.physics.barnesHut
            }
        });
    } else {
        // first initialization
        network = new vis.Network(container, data, options);

        // once network computed layout, animate
        network.once('stabilizationIterationsDone', function () {
            // small timeout to ensure positions are available
            setTimeout(() => {
                animateLoad(1200); // 1200ms animation
            }, 30);
        });

        // also try after first drawing as fallback
        network.once('afterDrawing', () => {
            setTimeout(() => {
                applyFit();
            }, 0);
        });
    }

    // Re-fit on window resize (debounced)
    window.addEventListener('resize', () => {
        clearTimeout(window._visFitTimeout);
        window._visFitTimeout = setTimeout(() => {
            try { network.fit(); } catch (e) {}
        }, 120);
    });
}


    // Le reste du fichier (fetchNetworkState, etc.) reste identique à la version précédente.
    async function fetchNetworkState() {
        try {
            const response = await fetch('api.php?action=get_network_state');
            const data = await response.json();

            if (data.status === 'success') {
                // Mettre à jour le tableau des stations
                stationsTableBody.innerHTML = '';
                data.stations.forEach(station => {
                    const row = `
                        <tr>
                            <td><strong>${station.nom}</strong></td>
                            <td>${parseFloat(station.capacite_disponible_cartes).toFixed(2)}</td>
                            <td>${createCapacityBar(station.capacite_utilisee_cartes, station.capacite_totale_cartes)}</td>
                        </tr>
                    `;
                    stationsTableBody.innerHTML += row;
                });

                // Mettre à jour le tableau des liens
                liensTableBody.innerHTML = '';
                data.liens.forEach(lien => {
                    const row = `
                        <tr>
                            <td>${lien.nom_depart} <i class="fas fa-long-arrow-alt-right"></i> ${lien.nom_arrivee}</td>
                            <td>${parseFloat(lien.capacite_disponible).toFixed(2)}</td>
                            <td>${createCapacityBar(lien.capacite_utilisee, lien.capacite_totale)}</td>
                        </tr>
                    `;
                    liensTableBody.innerHTML += row;
                });

                // Dessiner le diagramme
                drawNetworkDiagram(data.stations, data.liens);
                
                updateStationSelects(data.stations);
            } else {
                showResult(data.message, 'error');
            }
        } catch (error) {
            console.error(error);
            showResult('Erreur de connexion au serveur.', 'error');
        }
    }

    function updateStationSelects(stations) {
        const selectedSource = sourceSelect.value;
        const selectedDest = destinationSelect.value;
        
        sourceSelect.innerHTML = '<option value="">-- Choisir une station --</option>';
        destinationSelect.innerHTML = '<option value="">-- Choisir une station --</option>';

        stations.forEach(station => {
            sourceSelect.innerHTML += `<option value="${station.id}">${station.nom}</option>`;
            destinationSelect.innerHTML += `<option value="${station.id}">${station.nom}</option>`;
        });
        
        sourceSelect.value = selectedSource;
        destinationSelect.value = selectedDest;
    }
    
    function showResult(message, type) {
        resultZone.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'}"></i> ${message}`;
        resultZone.className = `result-zone ${type}`;
        resultZone.style.display = 'block';
    }

    bookingForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(bookingForm);
        const data = {
            source: formData.get('source'),
            destination: formData.get('destination'),
            throughput: formData.get('throughput')
        };
        
        if (!data.source || !data.destination || !data.throughput) {
            showResult('Veuillez remplir tous les champs.', 'error');
            return;
        }
        if (data.source === data.destination) {
            showResult('La station de départ et d\'arrivée doivent être différentes.', 'error');
            return;
        }

        try {
                const response = await fetch('api.php?action=reserve_capacity', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const result = await response.json();
                showResult(result.message, result.status);

                if (result.status === 'success') {
                    await fetchNetworkState(); 
                    
                    // ===================================================================
                    // MISE À JOUR : FOCUS SUR LE CHEMIN ENTIER
                    // ===================================================================
                    if (network && result.path_ids && result.path_ids.length > 0) {
                        network.fit({
                            nodes: result.path_ids, // Utiliser le tableau d'IDs du chemin
                            animation: {
                                duration: 1200,
                                easingFunction: 'easeInOutQuad'
                            }
                        });
                    }
                }
            } catch (error) {
                showResult('Erreur lors de la soumission de la réservation.', 'error');
            }
        });
    
    refreshBtn.addEventListener('click', () => {
        resultZone.style.display = 'none';
        resultZone.textContent = '';
        bookingForm.reset();
        fetchNetworkState();
    });

    zoomInBtn.addEventListener('click', () => {
        if (network) {
            const currentScale = network.getScale();
            network.moveTo({
                scale: currentScale * 1.3, // Zoom avant de 30%
                animation: { duration: 300, easingFunction: 'easeOutQuad' }
            });
        }
    });

    zoomOutBtn.addEventListener('click', () => {
        if (network) {
            const currentScale = network.getScale();
            network.moveTo({
                scale: currentScale / 1.3, // Zoom arrière de 30%
                animation: { duration: 300, easingFunction: 'easeOutQuad' }
            });
        }
    });

    fitBtn.addEventListener('click', () => {
        if (network) {
            // C'est la même fonction que celle utilisée au chargement.
            network.fit({
                animation: { duration: 800, easingFunction: 'easeInOutQuad' }
            });
        }
    });

    fetchNetworkState();
});