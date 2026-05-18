
        // ================================================================
        // 1. IDENTITY & SESSION LAYER
        // ================================================================

        function generateGUID() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }

        // Privacy: suppress GitHub.io referral UI feedback silently
        if (document.referrer && document.referrer.indexOf('github.io') !== -1) {
            console.log('[BLOSSOM TRAIL] GitHub.io referral detected — suppressed from UI.');
        }

        // Session init
        window.SESSION_GUID = sessionStorage.getItem('blossom_guid') || generateGUID();
        sessionStorage.setItem('blossom_guid', window.SESSION_GUID);

        // Source detection
        var _urlParams = new URLSearchParams(window.location.search);
        window.SESSION_SOURCE = _urlParams.get('source') || 'direct';

        console.log('[BLOSSOM TRAIL] Session started. GUID: ' + window.SESSION_GUID + ' | Source: ' + window.SESSION_SOURCE);

        // Survey data store
        var surveyData = {
            guid: window.SESSION_GUID,
            source: window.SESSION_SOURCE,
            professionalStatus: null,
            likert: { 1: null, 2: null, 3: null, 4: null, 5: null },
            serviceGapAnalysis: '',
            communityAssetMapping: '',
            timestamp: null
        };



        // ================================================================
        // 2. SURVEY INTERACTION
        // ================================================================
        // ── Removed Legacy Energy/Location Handlers ──


        // ── Tally form submission (placeholder — replace PLACEHOLDER with your Tally form ID)


        // ================================================================
        // 3. ACCORDION & NAVIGATION
        // ================================================================

        // Stage centroids for Full Mode (North East) auto-pan only
        var STAGE_CENTROIDS = {
            1: [54.8432, -1.4707],
            2: [54.706, -1.434],
            3: [54.915, -1.423],
            4: [55.031, -1.557],
            5: [55.034, -1.645]
        };

        // advanceTo — opens the target bucket WITHOUT auto-panning the map.
        // Map panning was removed to prevent sensory overload during survey navigation.
        // Users can pan/zoom the map independently at any time.
        // ── Validation gate toast


        function toggleBucket(id) {
            var bucket = document.getElementById('bucket-' + id);
            if (!bucket) return;
            var wasActive = bucket.classList.contains('active');
            document.querySelectorAll('.bucket').forEach(function (b) { b.classList.remove('active'); });
            if (!wasActive) {
                bucket.classList.add('active');
                setTimeout(function () { bucket.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 100);
            }
        }

        function showPane(p, btn) {
            document.querySelectorAll('.a11y-pane').forEach(function (el) { el.classList.remove('active'); });
            document.querySelectorAll('.a11y-tab').forEach(function (el) { el.classList.remove('active'); });
            document.getElementById('pane-' + p).classList.add('active');
            btn.classList.add('active');
        }


        // ================================================================
        // 4. MAP & TRAIL LOGIC
        // ================================================================

        (function () {
            // Initial view: neutral UK-wide — no region defaulting to NE.
            // The correct region view is applied when the user selects their LA.
            var UK_DEFAULT = [54.5, -2.5];
            var map = L.map('map', { zoomSnap: 0.5, zoomControl: false }).setView(UK_DEFAULT, 6);
            L.control.zoom({ position: 'topright' }).addTo(map);
            window._mapRef = map;

            // Hide the tile-loading overlay once the first tile batch completes
            function hideMapLoader() {
                var loader = document.getElementById('map-loading');
                if (loader) {
                    loader.classList.add('hidden');
                    setTimeout(function () { if (loader.parentNode) loader.parentNode.removeChild(loader); }, 600);
                }
            }

            var isRaining = false;
            var markerLayer = L.layerGroup().addTo(map);
            var communityLayer = L.layerGroup().addTo(map);
            var vanMarker = null;
            // Weather lat/lon — NE centroid so weather loads immediately
            var _weatherLat = 54.843, _weatherLon = -1.470;

            var backupHubs = [
                { name: 'Houghton Library WC', lat: 54.8452, lon: -1.4723, type: 'Verified Hub' },
                { name: 'Houghton Care Centre NHS', lat: 54.8445, lon: -1.4758, type: 'NHS Accessible' },
                { name: 'Washington Old Hall Visitor WC', lat: 54.903, lon: -1.516, type: 'Verified Hub' },
                { name: 'Durham Market Place', lat: 54.776, lon: -1.575, type: 'Verified Radar' },
                { name: 'Old Durham Gardens Hub', lat: 54.773, lon: -1.558, type: 'Verified Hub' },
                { name: 'Preston Park Cafe Hub', lat: 54.535, lon: -1.336, type: 'Verified Hub' },
                { name: 'Ormesby Hall Toilets', lat: 54.544, lon: -1.182, type: 'Verified Hub' },
                { name: 'Angel of the North Public WC', lat: 54.914, lon: -1.588, type: 'Verified Hub' },
                { name: 'Byron Place Seaham Hub', lat: 54.836, lon: -1.332, type: 'Verified Hub' },
                { name: 'Roker Pier Hub', lat: 54.922, lon: -1.368, type: 'Verified Hub' },
                { name: 'South Marine Hub WC', lat: 55.000, lon: -1.421, type: 'Verified Hub' },
                { name: 'Jesmond Dene Visitor WC', lat: 54.991, lon: -1.589, type: 'Verified Hub' },
                { name: 'Tyne Bridge Quayside Hub', lat: 54.968, lon: -1.605, type: 'Verified Hub' },
                { name: 'Alnwick Garden Centre WC', lat: 55.415, lon: -1.705, type: 'Verified Hub' },
                { name: 'Castle Eden Dene Hub', lat: 54.749, lon: -1.325, type: 'Verified Hub' },
                { name: 'Gibside Hub WC', lat: 54.925, lon: -1.727, type: 'Verified Hub' },
                { name: 'Whitley Lodge Library WC', lat: 55.051, lon: -1.450, type: 'Verified Hub' },
                { name: 'Saltburn Pier WC', lat: 54.585, lon: -0.977, type: 'Verified Radar' },
                { name: "Hadrian's Wall Hub WC", lat: 55.002, lon: -2.361, type: 'Verified Hub' },
                { name: 'Bamburgh Visitor Centre', lat: 55.609, lon: -1.710, type: 'Verified Hub' },
                { name: 'Seaham Shopping Hub', lat: 54.837, lon: -1.331, type: 'Verified Hub' },
                { name: 'Priory Gardens', lat: 54.54998, lon: -1.05124, type: 'Verified Hub' },
                { name: 'Penshaw Monument', lat: 54.87829, lon: -1.48095, type: 'Verified Hub' },
                { name: 'Tees Transporter Bridge', lat: 54.57602, lon: -1.23923, type: 'Verified Hub' },
                { name: 'Hardwick Park', lat: 54.65289, lon: -1.46655, type: 'Verified Hub' },
                { name: 'Bishop Auckland Castle', lat: 54.66671, lon: -1.67015, type: 'Verified Hub' },
                { name: 'Hamsterley Forest', lat: 54.65857, lon: -1.93246, type: 'Verified Hub' },
                { name: "St John's Chapel, Weardale", lat: 54.73600, lon: -2.17724, type: 'Verified Hub' }
            ];

            var sites = [
                { name: 'Penshaw Monument', stage: 2, lat: 54.882, lon: -1.481, type: 'landmark', img: 'penshaw.jpg', access: 'Paved' },
                { name: 'Tees Transporter Bridge', stage: 3, lat: 54.585, lon: -1.230, type: 'landmark', img: 'transporter.jpg', access: 'Paved' },
                { name: 'Hardwick Park', stage: 4, lat: 54.654, lon: -1.464, type: 'landmark', img: 'hardwick-park.jpg', access: 'Paved' },
                { name: 'Bishop Auckland Castle', stage: 5, lat: 54.666, lon: -1.670, type: 'landmark', img: 'bishop-auckland.jpg', access: 'Paved' },
                { name: 'Hamsterley Forest', stage: 6, lat: 54.673, lon: -1.890, type: 'landmark', img: 'hamsterley-forest.jpg', access: 'Gravel' },
                { name: 'Priory Gardens', stage: 7, lat: 54.54998, lon: -1.05124, type: 'blossom', img: 'priory-gardens.jpg', access: 'Uneven' },
                { name: 'St. John\'s Chapel', stage: 7, lat: 54.737, lon: -2.176, type: 'landmark', img: 'st-johns-chapel.jpg', access: 'Paved' },
                { name: 'Houghton le Spring', stage: 1, lat: 54.8432, lon: -1.4707, type: 'blossom', img: 'white-harmony.jpg', access: 'Paved' },
                { name: 'Washington Old Hall', stage: 2, lat: 54.9027, lon: -1.5165, type: 'blossom', img: 'washington.jpg', access: 'Gravel' },
                { name: 'Durham City', stage: 2, lat: 54.773, lon: -1.576, type: 'landmark', img: 'durham.jpg', access: 'Cobbles' },
                { name: 'Old Durham Gardens', stage: 2, lat: 54.773, lon: -1.558, type: 'blossom', img: 'old-durham.jpg', access: 'Gravel' },
                { name: 'Preston Park', stage: 2, lat: 54.5360, lon: -1.3370, type: 'blossom', img: 'preston.jpg', access: 'Tarmac' },
                { name: 'Ormesby Hall', stage: 2, lat: 54.5432, lon: -1.1830, type: 'blossom', img: 'ormesby.jpg', access: 'Sloped' },
                { name: 'Angel of the North', stage: 3, lat: 54.9141, lon: -1.5895, type: 'landmark', img: 'angel.jpg', access: 'Grass' },
                { name: 'Seaham', stage: 3, lat: 54.823, lon: -1.3189, type: 'landmark', img: 'seaham.jpg', access: 'Level' },
                { name: 'Roker Pier', stage: 3, lat: 54.924, lon: -1.365, type: 'landmark', img: 'roker.jpg', access: 'Concrete' },
                { name: 'South Marine Park', stage: 3, lat: 55.0001, lon: -1.4202, type: 'landmark', img: 'south-marine.jpg', access: 'Tarmac' },
                { name: 'Jesmond Dene', stage: 4, lat: 54.9900, lon: -1.5900, type: 'blossom', img: 'jesmond.jpg', access: 'Woodland' },
                { name: 'Tyne Bridge', stage: 4, lat: 54.968, lon: -1.606, type: 'landmark', img: 'tyne-bridge.jpg', access: 'Paved' },
                { name: 'Alnwick Garden', stage: 4, lat: 55.4155, lon: -1.7060, type: 'blossom', img: 'alnwick.jpg', access: 'Level' },
                { name: 'Castle Eden Dene', stage: 4, lat: 54.7500, lon: -1.3263, type: 'landmark', img: 'castle-eden.jpg', access: 'Uneven' },
                { name: 'Gibside', stage: 5, lat: 54.9245, lon: -1.7267, type: 'blossom', img: 'gibside.jpg', access: 'Gravel' },
                { name: 'Whitley Lodge', stage: 5, lat: 55.0501, lon: -1.4510, type: 'blossom', img: 'whitley.jpg', access: 'Paved' },
                { name: 'Saltburn Pier', stage: 5, lat: 54.586, lon: -0.978, type: 'landmark', img: 'saltburn.jpg', access: 'Lift' },
                { name: "Hadrian's Wall", stage: 5, lat: 55.002, lon: -2.360, type: 'landmark', img: 'hadrian.jpg', access: 'Grass' },
                { name: 'Bamburgh Castle', stage: 5, lat: 55.6089, lon: -1.7099, type: 'landmark', img: 'bamburgh.jpg', access: 'Sandy' }
            ];

            var stages = [
                { id: 1, title: 'Reset', domain: 'Environment', text: 'Wellness system check-in.', statement: "My local environments are well-aligned with my specific sensory needs and communication style.", technique: '<b>Technique 1: 5-4-3-2-1</b><br>Identify 5 things you see, 4 touch, 3 hear, 2 smell, 1 taste. Anchors you in the present.' },
                { id: 2, title: 'Expansion', domain: 'Sustainability', text: 'Expansive views.', statement: "I feel confident that my daily activities are sustainable without risking my financial or energy levels.", technique: '<b>Technique 2: Box Breathing</b><br>Inhale 4s, hold 4s, exhale 4s, hold empty 4s. Regulates heart rate.' },
                { id: 3, title: 'Flow', domain: 'Support Model', text: 'Allow movement and reflection.', statement: "A coaching model that prioritises nervous system regulation is essential for my progress.", technique: '<b>Technique 3: Wrist Cooling</b><br>Run cold water over wrists for 30s to help reset a triggered nervous system.' },
                { id: 4, title: 'Connection', domain: 'Technology', text: 'Belonging without blending.', statement: "The use of digital tools is an effective way for me to reduce the \u2018executive function tax\u2019 I face.", technique: '<b>Technique 4: Firm Pressure</b><br>Give yourself a firm hug. Deep pressure helps the brain process where the body is in space.' },
                { id: 5, title: 'Breathe', domain: 'Local Awareness', text: 'Travel toward the coast.', statement: "Current support services in my area demonstrate a clear understanding of neurodivergent burnout.", technique: '<b>Technique 5: Humming</b><br>Hum a low note to feel the vibration in your chest. Stimulates the Vagus nerve to soothe stress.' }
            ];

            // ── Tile layer references for mode switching
            var tileLayerOSM = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
            var currentTile = tileLayerOSM;
            currentTile.addTo(map);
            // Hide loading overlay once initial tiles are loaded
            currentTile.once('load', hideMapLoader);
            // Fallback: hide overlay after 5s even if tiles are slow
            setTimeout(hideMapLoader, 5000);

            // Recenter: pan to van if live, otherwise pan to NE trail centre
            var TRAIL_CENTRE = [54.843, -1.470]; // North East England fallback
            function recenterOnVan() {
                if (!map) return;
                if (vanMarker) {
                    map.setView(vanMarker.getLatLng(), 15, { animate: true });
                } else {
                    // Van not yet live — recentre on NE trail overview
                    map.setView(TRAIL_CENTRE, 9, { animate: true });
                }
            }
            document.getElementById('recenter-btn').addEventListener('click', recenterOnVan);


            // Rain toggle removed — rain state is derived from live weather API only.

            // ── Dynamic Radar Search: live accessible toilet & radar-key facility finder
            // Scoped to the selected Local Authority bounding box — not the full map viewport.
            // Radar is OFF by default; requires a Local Authority to be selected first.
            var radarActive = false;
            var radarLayer = L.layerGroup().addTo(map);

            var wcIcon = L.divIcon({
                html: '<div style="background:#005ea5;color:white;border-radius:50%;width:30px;height:30px;display:flex;align-items:center;justify-content:center;border:2px solid white;font-size:15px;box-shadow:0 2px 6px rgba(0,0,0,0.5);">♿</div>',
                className: '', iconSize: [30, 30], iconAnchor: [15, 15]
            });
            var radarIcon = L.divIcon({
                html: '<div style="background:#7c4dff;color:white;border-radius:50%;width:30px;height:30px;display:flex;align-items:center;justify-content:center;border:2px solid white;font-size:14px;box-shadow:0 2px 6px rgba(0,0,0,0.5);">🔑</div>',
                className: '', iconSize: [30, 30], iconAnchor: [15, 15]
            });

            // Per-LA bounding boxes [south, west, north, east] â€” North East England only
            // Returns bounding box for current map view
            function getLABounds() {
                var bounds = map.getBounds();
                return { south: bounds.getSouth().toFixed(5), west: bounds.getWest().toFixed(5), north: bounds.getNorth().toFixed(5), east: bounds.getEast().toFixed(5) };
            }

            async function fetchRadarToilets() {
                if (!radarActive) return;
                var bb = getLABounds();
                if (!bb) { console.warn('[BLOSSOM TRAIL] No LA bounds — radar aborted.'); return; }
                var south = bb.south, west = bb.west, north = bb.north, east = bb.east;
                var query =
                    '[out:json][timeout:20];' +
                    '(' +
                    'node["amenity"="toilets"]["wheelchair"~"yes|designated"](' + south + ',' + west + ',' + north + ',' + east + ');' +
                    'node["amenity"="toilets"]["access:key_scheme"="radar"](' + south + ',' + west + ',' + north + ',' + east + ');' +
                    'node["amenity"="toilets"]["toilets:access"="radar_key"](' + south + ',' + west + ',' + north + ',' + east + ');' +
                    'node["amenity"="toilets"]["locked"="radar_key"](' + south + ',' + west + ',' + north + ',' + east + ');' +
                    'node["access:key_scheme"="radar"]["amenity"!=""](' + south + ',' + west + ',' + north + ',' + east + ');' +
                    ');' +
                    'out body;';
                try {
                    var res = await fetch('https://overpass-api.de/api/interpreter', {
                        method: 'POST', body: 'data=' + encodeURIComponent(query)
                    });
                    var data = await res.json();
                    radarLayer.clearLayers();
                    data.elements.forEach(function (el) {
                        if (!el.lat) return;
                        var isRadar = (el.tags['access:key_scheme'] === 'radar' ||
                            el.tags['toilets:access'] === 'radar_key' ||
                            el.tags['locked'] === 'radar_key');
                        var icon = isRadar ? radarIcon : wcIcon;
                        var name = el.tags.name || (isRadar ? '🔑 Radar Key Facility' : '♿ Accessible Toilet');
                        var opening = el.tags.opening_hours ? '<br>Hours: ' + el.tags.opening_hours : '';
                        var fee = el.tags.fee === 'yes' ? '<br><em>Fee required</em>' : '';
                        var keyNote = isRadar ? '<br><strong style="color:#7c4dff;">🔑 Requires Radar Key</strong>' : '';
                        L.marker([el.lat, el.lon], { icon: icon }).addTo(radarLayer)
                            .bindPopup('<div style="color:#000;"><strong>' + name + '</strong>' + keyNote + opening + fee + '</div>');
                    });
                    var count = data.elements.length;
                    var btn = document.getElementById('btn-radar');
                    if (btn) btn.title = count + ' accessible facilities found in your selected region';
                    console.log('[BLOSSOM TRAIL] Radar Search (region-scoped): ' + count + ' facilities found.');
                } catch (e) {
                    console.warn('[BLOSSOM TRAIL] Radar Search failed:', e);
                }
            }

            window.toggleRadar = function () {
                radarActive = !radarActive;
                var btn = document.getElementById('btn-radar');
                if (btn) {
                    btn.textContent = radarActive ? '♿ 🔑 Amenities: ACTIVE' : '♿ 🔑 Show Amenities in My Area';
                    btn.style.background = radarActive ? '#4a148c' : '#005ea5';
                }
                if (radarActive) {
                    fetchRadarToilets();
                } else {
                    radarLayer.clearLayers();
                }
            };

            // Radar is LA-scoped — no re-query on map pan needed
            map.on('moveend zoomend', function () { /* no-op: LA-scoped only */ });

            // ── Live Van Tracker: public users see the van live; driver broadcasts via ?driver=true
            // Van marker is created ONLY when valid GPS data arrives from the GAS endpoint.
            // Until the VanTracker Sheet is connected, no marker appears (correct behaviour).
            const TRACKER_URL = "https://script.google.com/macros/s/AKfycbyY6VVTkvHj1Ktk2BbunChPbBc5ePc3X4hs-H-Q-eMdlMCIuhYy-uaEOO6iGvyuf_9w6g/exec";
            
            function updateVanLocation(lat, lon) {
                if (!lat || !lon || isNaN(lat) || isNaN(lon)) return;
                if (vanMarker) {
                    vanMarker.setLatLng([lat, lon]);
                } else {
                    // First valid GPS response — create the marker now
                    vanMarker = L.marker([lat, lon], {
                        icon: L.icon({ iconUrl: 'test-van.svg', iconSize: [44, 44] }),
                        zIndexOffset: 1000,
                        title: 'Blossom Trail Van'
                    }).addTo(map);
                    console.log('[BLOSSOM TRAIL] Van marker placed at live GPS:', lat, lon);
                }
            }

            // Check if user is the driver passing ?driver=true in URL
            const isDriver = window.location.search.includes('driver=true');
            let broadcastInterval;

            if (isDriver) {
                // DRIVER MODE: Watch GPS and update locally + broadcast to Google Sheet every 10s
                let currentLat = null, currentLon = null;
                
                alert("Van Tracking Mode Activated! Make sure GPS is enabled.");

                let watchId = null;

                function startGPSWatch() {
                    if (watchId !== null) navigator.geolocation.clearWatch(watchId);
                    if (navigator.geolocation) {
                        watchId = navigator.geolocation.watchPosition(function(pos) {
                            currentLat = pos.coords.latitude;
                            currentLon = pos.coords.longitude;
                            updateVanLocation(currentLat, currentLon);
                            if (typeof updateGPSPanel === 'function') updateGPSPanel(currentLat, currentLon);
                        }, function(err) {
                            console.warn("GPS Tracking skipped or blocked: " + err.message);
                            if (typeof setGPSBroadcastStatus === 'function') setGPSBroadcastStatus('GPS error: ' + err.message, '#f44336');
                        }, { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 });
                    }
                }

                startGPSWatch();

                // Add a "Locate Me / Reconnect GPS" button for the driver
                const reconnectBtn = document.createElement('button');
                reconnectBtn.innerText = '📡 Reconnect GPS';
                reconnectBtn.style.cssText = 'position:fixed; bottom:80px; right:20px; z-index:1000; padding:12px 20px; background:#7c4dff; color:white; border:none; border-radius:30px; font-weight:bold; cursor:pointer; box-shadow:0 4px 15px rgba(0,0,0,0.5);';
                reconnectBtn.onclick = function() {
                    reconnectBtn.innerText = '🔄 Locating...';
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(function(pos) {
                            currentLat = pos.coords.latitude;
                            currentLon = pos.coords.longitude;
                            updateVanLocation(currentLat, currentLon);
                            reconnectBtn.innerText = '📡 Reconnect GPS';
                            startGPSWatch(); // Restart watcher to clear stale state
                        }, function(err) {
                            alert("Failed to reconnect GPS: " + err.message);
                            reconnectBtn.innerText = '📡 Reconnect GPS';
                        }, { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 });
                    }
                };
                document.body.appendChild(reconnectBtn);

                // GPS Diagnostic Panel
                var gpsPanel = document.createElement('div');
                gpsPanel.id = 'gps-status-panel';
                gpsPanel.style.cssText = 'position:fixed;top:14px;left:50%;transform:translateX(-50%);z-index:99999;background:rgba(10,0,30,0.95);color:#fff;padding:12px 20px;border-radius:10px;font-size:0.82em;min-width:310px;text-align:center;border:2px solid #7c4dff;box-shadow:0 4px 20px rgba(0,0,0,0.7);font-family:monospace;pointer-events:none;';
                gpsPanel.innerHTML =
                    '<div style="color:#7c4dff;font-weight:bold;margin-bottom:6px;font-family:sans-serif;">DRIVER MODE \u2014 GPS TRACKING</div>' +
                    '<div id="gps-coords">Waiting for GPS signal...</div>' +
                    '<div id="gps-broadcast" style="color:#aaa;font-size:0.9em;margin-top:3px;">No broadcasts sent yet</div>' +
                    '<div id="gps-last-result" style="font-size:0.85em;margin-top:3px;"></div>';
                document.body.appendChild(gpsPanel);

                function updateGPSPanel(lat, lon) {
                    var c = document.getElementById('gps-coords');
                    if (c) c.textContent = 'Lat: ' + lat.toFixed(6) + '  Lon: ' + lon.toFixed(6);
                }
                function setGPSBroadcastStatus(msg, colour) {
                    var b = document.getElementById('gps-broadcast');
                    if (b) { b.textContent = msg; b.style.color = colour || '#aaa'; }
                }
                function setGPSLastResult(msg, colour) {
                    var r = document.getElementById('gps-last-result');
                    if (r) { r.textContent = msg; r.style.color = colour || '#aaa'; }
                }

                // Broadcast to GAS every 10 seconds with visible status
                setInterval(function() {
                    if (currentLat !== null && currentLon !== null) {
                        var broadcastUrl = TRACKER_URL + '?update=true&lat=' + currentLat + '&lon=' + currentLon;
                        setGPSBroadcastStatus('Broadcasting... ' + new Date().toLocaleTimeString(), '#ffeb3b');
                        fetch(broadcastUrl)
                            .then(function(res) { return res.json(); })
                            .then(function(data) {
                                if (data && data.status === 'ok') {
                                    setGPSBroadcastStatus('Last broadcast: ' + new Date().toLocaleTimeString(), '#4caf50');
                                    setGPSLastResult('Sheet updated at ' + currentLat.toFixed(5) + ', ' + currentLon.toFixed(5), '#4caf50');
                                } else {
                                    setGPSBroadcastStatus('GAS returned: ' + JSON.stringify(data), '#ff9800');
                                    setGPSLastResult('Check GAS doGet handles ?update=true', '#ff9800');
                                }
                            })
                            .catch(function(err) {
                                setGPSBroadcastStatus('Broadcast failed: ' + err.message, '#f44336');
                                setGPSLastResult('Ensure GAS is deployed as Anyone can access', '#f44336');
                            });
                    } else {
                        setGPSBroadcastStatus('Waiting for GPS fix...', '#aaa');
                    }
                }, 10000);

            } else {
                // PUBLIC MODE: Poll the Apps Script every 30 seconds to fetch the live van location.
                // Van marker only appears once real {lat, lon} data is returned.
                function fetchLiveVanPosition() {
                    fetch(TRACKER_URL)
                        .then(res => res.json())
                        .then(data => {
                            if (data && data.lat && data.lon) {
                                updateVanLocation(parseFloat(data.lat), parseFloat(data.lon));
                            } else {
                                console.log('[BLOSSOM TRAIL] Van tracker: no GPS data yet (VanTracker Sheet pending).');
                            }
                        })
                        .catch(err => console.log('[BLOSSOM TRAIL] Tracker fetch error:', err));
                }

                // Initial fetch and 30s interval are set AFTER renderFullTrail() below
                window._fetchLiveVanPosition = fetchLiveVanPosition;
            }

            // -- Bloom-time prediction using Open-Meteo daily temperature
            // Heuristic: if 7-day mean temp ≥ 8°C and rising, blossom is near peak.
            async function fetchBloomPrediction(lat, lon) {
                try {
                    var url = 'https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + lon +
                        '&daily=temperature_2m_max,temperature_2m_min&forecast_days=7&timezone=Europe%2FLondon';
                    var res = await fetch(url);
                    var data = await res.json();
                    var maxTemps = data.daily.temperature_2m_max;
                    var minTemps = data.daily.temperature_2m_min;
                    var meanTemps = maxTemps.map(function (mx, i) { return (mx + minTemps[i]) / 2; });
                    var weekMean = meanTemps.reduce(function (a, b) { return a + b; }, 0) / meanTemps.length;
                    var trend = meanTemps[6] - meanTemps[0]; // positive = warming
                    var label, colour;
                    if (weekMean >= 12 && trend >= 0) {
                        label = '🌸 Peak Blossom'; colour = '#d81b60';
                    } else if (weekMean >= 8) {
                        label = '🌱 Approaching Bloom'; colour = '#7c4dff';
                    } else {
                        label = '❄️ Pre-Season'; colour = '#555';
                    }
                    var badge = document.getElementById('bloom-badge');
                    if (badge) { badge.textContent = label; badge.style.color = colour; }
                } catch (e) { /* silent */ }
            }

            // Full WMO Weather Interpretation Code table — Met Office aligned descriptions
            var WMO_CODES = {
                0: '☀️ Clear Sky',
                1: '🌤️ Mainly Clear',
                2: '⛅ Partly Cloudy',
                3: '☁️ Overcast',
                45: '🌫️ Fog',
                48: '🌫️ Freezing Fog',
                51: '🌦️ Light Drizzle',
                53: '🌦️ Moderate Drizzle',
                55: '🌧️ Heavy Drizzle',
                56: '🌧️ Freezing Drizzle',
                57: '🌧️ Heavy Freezing Drizzle',
                61: '🌧️ Light Rain',
                63: '🌧️ Moderate Rain',
                65: '🌧️ Heavy Rain',
                66: '🌨️ Freezing Rain',
                67: '🌨️ Heavy Freezing Rain',
                71: '🌨️ Light Snow',
                73: '🌨️ Moderate Snow',
                75: '🌨️ Heavy Snow',
                77: '❄️ Snow Grains',
                80: '🌦️ Light Showers',
                81: '🌦️ Moderate Showers',
                82: '🌧️ Heavy Showers',
                85: '🌨️ Snow Showers',
                86: '🌨️ Heavy Snow Showers',
                95: '⛈️ Thunderstorm',
                96: '⛈️ Thunderstorm with Hail',
                99: '⛈️ Heavy Thunderstorm with Hail'
            };
            var RAIN_CODES = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 85, 86, 95, 96, 99];

            function getMoonPhase(d) {
                var year = d.getFullYear(), month = d.getMonth() + 1, day = d.getDate();
                if (month < 3) { year--; month += 12; }
                var jd = Math.floor(365.25 * year) + Math.floor(30.6 * month + 0.5) + day - 694039.09;
                var phase = (jd / 29.5305882) % 1;
                if (phase < 0) phase += 1;
                if (phase < 0.03 || phase > 0.97) return '🌑 New Moon';
                if (phase < 0.22) return '🌒 Waxing Crescent';
                if (phase < 0.28) return '🌓 First Quarter';
                if (phase < 0.47) return '🌔 Waxing Gibbous';
                if (phase < 0.53) return '🌕 Full Moon';
                if (phase < 0.72) return '🌖 Waning Gibbous';
                if (phase < 0.78) return '🌗 Last Quarter';
                return '🌘 Waning Crescent';
            }

            async function fetchWeather() {
                try {
                    var url = 'https://api.open-meteo.com/v1/forecast?latitude=' + _weatherLat +
                        '&longitude=' + _weatherLon + '&current_weather=true';
                    var res = await fetch(url);
                    var data = await res.json();
                    var code = data.current_weather.weathercode;
                    isRaining = RAIN_CODES.indexOf(code) !== -1;
                    var weatherLabel = WMO_CODES[code] || ('Code ' + code);
                    document.getElementById('val-w').innerText = weatherLabel;
                    document.getElementById('val-t').innerText = Math.round(data.current_weather.temperature) + '°C';
                    document.getElementById('val-wind').innerText = Math.round(data.current_weather.windspeed) + ' mph';
                    var rainEl = document.getElementById('val-rain');
                    if (rainEl) {
                        rainEl.innerText = isRaining ? '☔ Yes' : '✓ No';
                        rainEl.style.color = isRaining ? '#ef9a9a' : '#a5d6a7';
                    }
                    var moonEl = document.getElementById('val-moon');
                    if (moonEl) moonEl.innerText = getMoonPhase(new Date());
                } catch (e) { /* silent fail */ }
                fetchBloomPrediction(_weatherLat, _weatherLon);
                if (window._renderTrail) window._renderTrail();
            }

            // ── Shared: build stage bucket shell


            // ── FULL MODE render (North East blossom trail)
            function renderFullTrail() {
                markerLayer.clearLayers();

                var neCentre = [54.843, -1.470];
                map.setView(neCentre, 9, { animate: true });
                _weatherLat = neCentre[0];
                _weatherLon = neCentre[1];

                window._markers = {}; // Added to track markers by name

                var coords = [];
                sites.forEach(function (s) {
                    var icon = s.type === 'blossom'
                        ? L.icon({ iconUrl: 'pink-blossom.png', iconSize: [32, 32] })
                        : new L.Icon.Default();
                    var marker = L.marker([s.lat, s.lon], {
                        icon: icon,
                        title: s.name + ' — ' + (s.type === 'blossom' ? 'Blossom Trail Site' : 'Landmark'),
                        alt: s.name
                    }).addTo(markerLayer);
                    var safeAccess = ['Paved', 'Concrete', 'Level', 'Tarmac', 'Lift'];
                    var advice = (isRaining && safeAccess.indexOf(s.access) === -1)
                        ? '<div class="weather-alert">&#9888;&#65039; Caution: ' + s.access + ' surface soft/slippery in rain.</div>'
                        : '';
                    marker.bindPopup('<div style="color:#000;"><strong style="color:var(--primary);">' + s.name + '</strong><div class="wc-status-box">Surface: ' + s.access + ' &#9855;</div>' + advice + (s.img ? '<img src="' + s.img + '" class="popup-img" alt="' + (s.imgAlt || (s.type === "blossom" ? "Blossom trees in bloom at " + s.name : s.name + " — landmark on the Blossom Trail")) + '" title="' + (s.imgAlt || s.name) + '">' : '') + '</div>', { autoPan: false });
                    coords.push([s.lat, s.lon]);

                    window._markers[s.name] = marker;
                });

                L.polyline(coords, { color: '#d81b60', weight: 4, opacity: 0.6, dashArray: '10, 15' }).addTo(markerLayer);
                if (!vanMarker) {
                    // Van marker is intentionally NOT created here with a hardcoded position.
                    // It will be created by updateVanLocation() when real GPS data arrives.
                }
            }

            // ── Lightweight blue-pin icon for generic landmarks in Light Mode
            // â”€â”€ Dispatcher â€” renders full NE trail, or clears for Online/unset
            function renderTrail() {
                renderFullTrail();
            }

            window.zoomToLocation = function (name) {
                var s = sites.find(function (site) { return site.name === name; });
                if (!s) {
                    s = sites.find(function (site) { return name.indexOf(site.name) !== -1 || site.name.indexOf(name) !== -1; });
                }
                if (s && map) {
                    map.setView([s.lat, s.lon], 15, { animate: false });
                    if (window._markers && window._markers[s.name]) {
                        window._markers[s.name].openPopup();
                    }
                    // Auto-collapse sidebar on mobile screens so map is visible!
                    if (window.innerWidth <= 768) {
                        document.querySelectorAll('.bucket').forEach(function (b) { b.classList.remove('active'); });
                    }
                }
            };

            window._renderTrail = renderTrail;

            map.on('moveend zoomend', function () {
                communityLayer.clearLayers();
                if (map.getZoom() >= 14) {
                    backupHubs.forEach(function (hub) {
                        if (map.getBounds().contains([hub.lat, hub.lon])) {
                            L.marker([hub.lat, hub.lon], {
                                icon: L.divIcon({
                                    html: '<div style="background:#005ea5;color:white;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;border:2px solid white;font-size:16px;box-shadow:0 2px 5px rgba(0,0,0,0.5);">&#9855;</div>',
                                    className: '', iconSize: [32, 32]
                                }),
                                title: hub.name + ' — ' + hub.type
                            }).addTo(communityLayer).bindPopup('<b>Verified WC: ' + hub.name + '</b><br>' + hub.type);
                        }
                    });
                }
            });

            fetchWeather();

            // Load blossom trail immediately on page open
            renderFullTrail();

            // Start van polling AFTER trail renders (fixes race condition)
            if (window._fetchLiveVanPosition) {
                window._fetchLiveVanPosition(); // initial fetch
                setInterval(window._fetchLiveVanPosition, 30000); // poll every 30s
            }
        })();

        // ── PWA: register service worker for offline support
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js').then(function (reg) {
                console.log('[BLOSSOM TRAIL] Service Worker registered:', reg.scope);
            }).catch(function (e) {
                console.log('[BLOSSOM TRAIL] SW registration failed:', e);
            });
        }
        var deferredPrompt;
        var installBtn = document.getElementById('install-app-btn');
        
        // Hide button if already installed (standalone mode)
        if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
            if (installBtn) installBtn.style.display = 'none';
        }

        window.addEventListener('beforeinstallprompt', function (e) {
            e.preventDefault();
            deferredPrompt = e;
            if (installBtn) { installBtn.style.display = 'flex'; }
        });
        if (installBtn) {
            installBtn.addEventListener('click', function (e) {
                if (deferredPrompt) {
                    deferredPrompt.prompt();
                    deferredPrompt.userChoice.then(function (choiceResult) {
                        if (choiceResult.outcome === 'accepted') { installBtn.style.display = 'none'; }
                        deferredPrompt = null;
                    });
                } else {
                    var ua = navigator.userAgent || navigator.vendor || window.opera;
                    var instructions = document.getElementById('install-instructions');
                    if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) {
                        instructions.innerHTML = "Tap the <strong>Share</strong> icon at the bottom of your screen and select <strong>'Add to Home Screen'</strong>.";
                    } else if (/android/i.test(ua)) {
                        instructions.innerHTML = "Tap the browser menu (<strong>⋮</strong>) and select <strong>'Add to Home Screen'</strong> or <strong>'Install App'</strong>.";
                    } else {
                        instructions.innerHTML = "Click the browser menu (<strong>⋯</strong> or <strong>⋮</strong>) in the top right, go to <strong>Apps</strong> (or Save and Share), and select <strong>'Install this site as an app'</strong>.";
                    }
                    document.getElementById('install-modal-overlay').classList.add('active');
                }
            });
        }
        window.addEventListener('appinstalled', function (evt) {
            if (installBtn) installBtn.style.display = 'none';
        });

        // Open Survey button handler
        const startSurveyBtn = document.getElementById('startSurveyBtn');
        if (startSurveyBtn) {
            startSurveyBtn.addEventListener('click', () => {
                window.open('survey.html', '_blank', 'noopener,noreferrer');
            });
        }
    