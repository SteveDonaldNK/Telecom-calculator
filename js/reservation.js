//reservation.js

document.addEventListener('DOMContentLoaded', () => {
  // éléments UI
  const stationsTableBody = document.getElementById('stations-table-body');
  const liensTableBody = document.getElementById('liens-table-body');
  const bookingForm = document.getElementById('booking-form');
  const resultZone = document.getElementById('result-zone');
  const refreshBtn = document.getElementById('refresh-btn');
  const zoomInBtn = document.getElementById('zoom-in-btn');
  const zoomOutBtn = document.getElementById('zoom-out-btn');
  const fitBtn = document.getElementById('fit-btn');

  // Get select elements - using direct references
  const sourceSelect = document.getElementById('source_station');
  const destinationSelect = document.getElementById('destination_station');
  const throughputInput = document.getElementById('throughput');

  // vis.js network
  let network = null;
  const nodesDS = new vis.DataSet();
  const edgesDS = new vis.DataSet();
  const edgesIndex = new Map(); // "from_to" -> [edgeId,...]

  // Helper: safe HTML escape
  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function createCapacityBar(used, total) {
    used = Number(used || 0);
    total = Number(total || 0);
    if (!total) {
      return '<div class="capacity-bar"><div class="low" style="width: 100%;">N/A</div></div>';
    }
    const percentageUsed = (used / total) * 100;
    let colorClass = 'high';
    if (percentageUsed >= 80) colorClass = 'low';
    else if (percentageUsed >= 50) colorClass = 'medium';
    return `<div class="capacity-bar" title="${percentageUsed.toFixed(1)}% Utilisé"><div class="${colorClass}" style="width: ${percentageUsed.toFixed(2)}%;">${percentageUsed.toFixed(0)}%</div></div>`;
  }

  // Build nodes & edges with fallbacks for missing names.
  function buildNodesEdges(stations = [], liens = []) {
    edgesIndex.clear();
    const nodesArray = stations.map(station => {
      const id = station.id ?? station.station_id ?? station._id ?? '';
      const name = (station.nom ?? station.name ?? station.label ?? `Station ${id}`) || `Station ${id}`;
      const available = Number(station.capacite_totale_cartes || 0) - Number(station.capacite_utilisee_cartes || 0);
      return {
        id: String(id),
        label: String(name),
        size: 20,
        color: { background: '#D2E5FF', border: '#2B7CE9' },
        title: `${escapeHtml(name)}
        Capacité Cartes Dispo: ${available.toFixed(2)} Gbps`
      };
    });

    const edgesArray = liens.map(lien => {
      const id = lien.id ?? lien.link_id ?? '';
      const from = String(lien.station_depart_id ?? lien.from_id ?? '');
      const to = String(lien.station_arrivee_id ?? lien.to_id ?? '');
      const used = Number(lien.capacite_utilisee || 0);
      const total = Number(lien.capacite_totale || 0);
      const available = total - used;
      const percentageUsed = total > 0 ? (used / total) * 100 : 0;
      let color = '#28a745';
      if (percentageUsed >= 80) color = '#dc3545';
      else if (percentageUsed >= 50) color = '#ffc107';
      const finalWidth = 3 + (percentageUsed / 20);
      const edgeObj = {
        id: String(id),
        from,
        to,
        label: `${available.toFixed(0)}G Dispo`,
        font: { background: 'white', size: 12, strokeWidth: 0 },
        title: `Lien: ${escapeHtml(lien.nom_depart ?? lien.from_name ?? '')} ➔ ${escapeHtml(lien.nom_arrivee ?? lien.to_name ?? '')}
        Utilisé: ${used.toFixed(2)} / ${total} Gbps
        Disponible: ${available.toFixed(2)} Gbps`,
        color: { color, highlight: '#007bff', hover: '#007bff' },
        width: finalWidth,
        _finalWidth: finalWidth
      };
      const key = `${edgeObj.from}_${edgeObj.to}`;
      if (!edgesIndex.has(key)) edgesIndex.set(key, []);
      edgesIndex.get(key).push(edgeObj.id);
      return edgeObj;
    });

    return { nodesArray, edgesArray };
  }

  // Draw or update network
  function drawNetworkDiagram(stations, liens) {
    const { nodesArray, edgesArray } = buildNodesEdges(stations, liens);

    nodesDS.clear();
    edgesDS.clear();
    if (nodesArray.length) nodesDS.add(nodesArray);
    if (edgesArray.length) edgesDS.add(edgesArray);

    if (!network) {
      const container = document.getElementById('network-diagram');
      const data = { nodes: nodesDS, edges: edgesDS };
      const options = {
        edges: { smooth: { type: 'dynamic' } },
        physics: { barnesHut: { gravitationalConstant: -15000, springLength: 250, springConstant: 0.05 } },
        interaction: { hover: true, tooltipDelay: 100 }
      };
      network = new vis.Network(container, data, options);
      network.once('afterDrawing', () => network.fit({ animation: { duration: 600 } }));
    }
  }

  // Highlight path using edgesIndex for O(1) edge lookup
  function highlightPath(path_ids = []) {
    // reset nodes
    const allNodeIds = nodesDS.getIds();
    const nodeUpdates = allNodeIds.map(id => ({ id, color: { border: '#2B7CE9' }, borderWidth: 2 }));
    if (nodeUpdates.length) nodesDS.update(nodeUpdates);

    // reset edges widths
    const allEdges = edgesDS.get();
    const edgeUpdates = allEdges.map(e => ({ id: e.id, width: e._finalWidth || 3 }));
    if (edgeUpdates.length) edgesDS.update(edgeUpdates);

    if (!path_ids || path_ids.length === 0) return;

    // highlight nodes
    const pathNodeUpdates = path_ids.map(id => ({ id: String(id), color: { border: '#e67e22' }, borderWidth: 4 }));
    nodesDS.update(pathNodeUpdates);

    // highlight edges
    const pathEdgeUpdates = [];
    for (let i = 0; i < path_ids.length - 1; i++) {
      const key = `${String(path_ids[i])}_${String(path_ids[i + 1])}`;
      const ids = edgesIndex.get(key);
      if (ids && ids.length) ids.forEach(eid => pathEdgeUpdates.push({ id: eid, width: 8 }));
    }
    if (pathEdgeUpdates.length) edgesDS.update(pathEdgeUpdates);
  }

  // Render tables and select options. Defensive for missing fields.
  function renderTablesAndSelects(stations = [], liens = []) {
    if (!Array.isArray(stations)) stations = [];
    if (!Array.isArray(liens)) liens = [];

    // Build table markup
    const sRows = stations.map(station => {
      const id = station.id ?? station.station_id ?? '';
      const name = station.nom ?? station.name ?? station.label ?? `Station ${id}`;
      const available = Number(station.capacite_totale_cartes || 0) - Number(station.capacite_utilisee_cartes || 0);
      return `<tr>
        <td><strong>${escapeHtml(name)}</strong></td>
        <td>${available.toFixed(2)}</td>
        <td>${createCapacityBar(Number(station.capacite_utilisee_cartes || 0), Number(station.capacite_totale_cartes || 0))}</td>
      </tr>`;
    }).join('');

    const lRows = liens.map(lien => {
      const nomDepart = lien.nom_depart ?? lien.from_name ?? '';
      const nomArrivee = lien.nom_arrivee ?? lien.to_name ?? '';
      const available = Number(lien.capacite_totale || 0) - Number(lien.capacite_utilisee || 0);
      return `<tr>
        <td>${escapeHtml(nomDepart)} <i class="fas fa-long-arrow-alt-right"></i> ${escapeHtml(nomArrivee)}</td>
        <td>${available.toFixed(2)}</td>
        <td>${createCapacityBar(Number(lien.capacite_utilisee || 0), Number(lien.capacite_totale || 0))}</td>
      </tr>`;
    }).join('');

    // Preserve selected values
    const prevSrc = sourceSelect ? sourceSelect.value : '';
    const prevDst = destinationSelect ? destinationSelect.value : '';

    // Build options HTML
    const optionsHtml = stations.map(station => {
      const id = String(station.id ?? station.station_id ?? '');
      const name = station.nom ?? station.name ?? station.label ?? `Station ${id}`;
      return `<option value="${escapeHtml(id)}">${escapeHtml(name)}</option>`;
    }).join('');

    const fullOptions = '<option value="">-- Choisir une station --</option>' + optionsHtml;

    // Update DOM
    if (stationsTableBody) stationsTableBody.innerHTML = sRows;
    if (liensTableBody) liensTableBody.innerHTML = lRows;
    
    if (sourceSelect) {
      sourceSelect.innerHTML = fullOptions;
      // Restore previous selection if it still exists
      if (prevSrc && Array.from(sourceSelect.options).some(o => o.value === prevSrc)) {
        sourceSelect.value = prevSrc;
      }
    }
    
    if (destinationSelect) {
      destinationSelect.innerHTML = fullOptions;
      // Restore previous selection if it still exists
      if (prevDst && Array.from(destinationSelect.options).some(o => o.value === prevDst)) {
        destinationSelect.value = prevDst;
      }
    }
  }

  // show result in UI
  function showResult(message, type, result_data = {}) {
    // La variable result_data contiendra { path_names: [], backup_paths: [] }
    const path_names = result_data.path_names || [];
    const backup_paths = result_data.backup_paths || [];

    let finalMessage = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'}"></i> ${message}`;
    
    // Afficher le chemin principal
    if (type === 'success' && path_names.length > 0) {
        finalMessage += `<br><small><strong>Chemin Principal:</strong> ${path_names.join(' → ')}</small>`;
    }

    // Afficher les chemins de secours s'il y en a
    console.log(backup_paths)
    if (type === 'success' && backup_paths.length > 0) {
        finalMessage += `<hr style="margin: 8px 0; border-top: 1px solid #ccc;">`;
        finalMessage += `<small><strong>Chemins de Secours Disponibles:</strong></small>`;
        finalMessage += `<ul style="margin: 5px 0 0 20px; text-align: left; font-size: 0.8em;">`;
        backup_paths.forEach(path => {
            finalMessage += `<li>${path}</li>`;
        });
        finalMessage += `</ul>`;
    }

    resultZone.innerHTML = finalMessage;
    resultZone.className = `result-zone ${type}`;
    resultZone.style.display = 'block';
}

  // fetch network state with verbose logging (for debugging)
  let currentFetchController = null;
  async function fetchNetworkState() {
    // cancel previous if any
    if (currentFetchController) currentFetchController.abort();
    currentFetchController = new AbortController();
    const signal = currentFetchController.signal;

    try {
      console.log('fetchNetworkState: fetching api.php?action=get_network_state');
      const res = await fetch('api.php?action=get_network_state', { signal });
      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        console.warn('fetchNetworkState: HTTP error', res.status, txt);
        showResult('Erreur serveur lors de la récupération.', 'error');
        return;
      }
      const data = await res.json().catch(async e => {
        const raw = await res.text().catch(() => '');
        console.error('fetchNetworkState: JSON parse failed. Raw response:', raw);
        throw e;
      });

      console.log('fetchNetworkState response:', data);

      if (data && data.status === 'success' && Array.isArray(data.stations) && Array.isArray(data.liens)) {
        // defensive normalization: ensure station ids are strings
        data.stations = data.stations.map(s => ({ ...s, id: String(s.id ?? s.station_id ?? '') }));
        data.liens = data.liens.map(l => ({ ...l, id: String(l.id ?? l.link_id ?? '') , station_depart_id: String(l.station_depart_id ?? l.from_id ?? ''), station_arrivee_id: String(l.station_arrivee_id ?? l.to_id ?? '') }));

        renderTablesAndSelects(data.stations, data.liens);
        drawNetworkDiagram(data.stations, data.liens);
      } else {
        console.warn('fetchNetworkState: unexpected payload', data);
        showResult((data && data.message) ? data.message : 'Format de réponse inattendu', 'error');
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('fetchNetworkState: aborted (new fetch started).');
        return;
      }
      console.error('fetchNetworkState error:', err);
      showResult('Erreur de connexion au serveur.', 'error');
    } finally {
      currentFetchController = null;
    }
  }

  // Booking form handling
  let bookingInProgress = false;
  bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (bookingInProgress) return;
    
    const data = {
      source: sourceSelect ? String(sourceSelect.value) : '',
      destination: destinationSelect ? String(destinationSelect.value) : '',
      throughput: throughputInput ? String(throughputInput.value) : ''
    };
    
    if (!data.source || !data.destination || !data.throughput) {
      showResult('Veuillez remplir tous les champs.', 'error');
      return;
    }
    if (data.source === data.destination) {
      showResult('La station de départ et d\'arrivée doivent être différentes.', 'error');
      return;
    }
    
    bookingInProgress = true;
    const submitBtn = bookingForm.querySelector('[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;
    
    try {
      const res = await fetch('api.php?action=reserve_capacity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      console.log('reserve_capacity response:', result);
      showResult(result.message || 'Réponse inconnue', result.status || 'info', result);
      if (result.status === 'success') {
        await fetchNetworkState();
        if (result.path_ids) highlightPath(result.path_ids.map(String));
      }
    } catch (err) {
      console.error('reserve_capacity error:', err);
      showResult('Erreur lors de la soumission de la réservation.', 'error');
    } finally {
      bookingInProgress = false;
      if (submitBtn) submitBtn.disabled = false;
    }
  });

  // Refresh button
  let refreshLocked = false;
  refreshBtn.addEventListener('click', () => {
    if (refreshLocked) return;
    refreshLocked = true;
    resultZone.style.display = 'none';
    bookingForm.reset();
    highlightPath([]);
    fetchNetworkState();
    setTimeout(() => (refreshLocked = false), 800);
  });

  // Zoom controls
  zoomInBtn.addEventListener('click', () => network && network.moveTo({ scale: network.getScale() * 1.3 }));
  zoomOutBtn.addEventListener('click', () => network && network.moveTo({ scale: network.getScale() / 1.3 }));
  fitBtn.addEventListener('click', () => network && network.fit());

  // initial fetch
  fetchNetworkState();
}); 