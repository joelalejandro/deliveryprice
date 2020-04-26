function init() {
    const { Map, Location, loadModule } = Microsoft.Maps;
    const { latitude, longitude } = shopConfig.sourceLocation.location;
    map = new Map(document.getElementById("map"), {
        center: new Location(latitude, longitude),
        zoom: 12
    });
    loadModule("Microsoft.Maps.Search", function() {
        window.addEventListener("message", function(event) {
            var payload = JSON.parse(event.data);
            if (!payload || !payload.dp) {
                return;
            }
            
            if (payload.dp.action === "storeShippingAddress") {
                const { address, number, city } = payload.dp.data;
                const searchManager = new Microsoft.Maps.Search.SearchManager(map);
                searchManager.geocode({
                    bounds: map.getBounds(),
                    where: `${address} ${number}, ${city}, Córdoba, Argentina`,
                    callback: function(answer) {
                        map.setView({ bounds: answer.results[0].bestView });
                        calculateDistance(answer.results[0], `${address} ${number}`);
                    }
                });
                return;
            }
        });
        window.parent.postMessage(JSON.stringify({ dp: { action: "requestShippingAddress" }}), "*");
    });
}

function calculateDistance(suggestionResult, address) {
    const { latitude, longitude } = shopConfig.sourceLocation.location;
    const { Pushpin, Location } = Microsoft.Maps;
    map.entities.clear();
    const shopLocation = new Location(latitude, longitude);
    const source = new Pushpin(shopLocation);
    const destination = new Pushpin(suggestionResult.location);
    map.entities.push(source);
    map.entities.push(destination);
    Microsoft.Maps.loadModule("Microsoft.Maps.SpatialMath", function() {
        const distance = Microsoft.Maps.SpatialMath.getDistanceTo(source.getLocation(), destination.getLocation(), Microsoft.Maps.SpatialMath.DistanceUnits.Kilometers);
        const distanceContainer = document.querySelector(".distance-container");
        const costContainer = document.querySelector(".cost-container");
        const addressContainer = document.querySelector(".address-container");
        const distanceElement = distanceContainer.querySelector("#distance");
        const costElement = costContainer.querySelector("#cost");
        const addressElement = addressContainer.querySelector("#address");
        distanceElement.innerHTML = `${distance.toFixed(1)} Km`;
        costElement.innerHTML = `$ ${calculatePrice(distance.toFixed(1))}`;
        addressElement.innerHTML = address;
        distanceContainer.style.display = "block";
        costContainer.style.display = "block";
        addressContainer.style.display = "block";
    });
}

function calculatePrice(distance) {
    const { zones } = shopConfig;
    let matchingZone = zones.find(zone => !zone.perKilometer && distance > zone.minimumDistance && distance <= zone.maximumDistance);

    if (!matchingZone) {
        matchingZone = zones.find(zone => zone.perKilometer);
    }

    let price = matchingZone.cost;

    if (matchingZone.perKilometer) {
        price += Math.ceil(distance - matchingZone.minimumDistance) / matchingZone.perKilometer.step * matchingZone.perKilometer.costIncrease;
    }

    if (shopConfig.integrations.tiendanube && shopConfig.integrations.tiendanube.autoselectShippingOption) {
        const message = {
            dp: {
                action: "selectShippingOption",
                data: {
                    selectedZone: matchingZone,
                    matchingShippingOptionID: shopConfig.integrations.tiendanube.zonesToShippingOptionIDs[matchingZone.id]
                }
            }
        }
        window.parent.postMessage(JSON.stringify(message), "*");
    }

    return price;
}