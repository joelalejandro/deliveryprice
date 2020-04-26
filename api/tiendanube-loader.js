import {loadWidget} from "./lib";

export default async (req, res) => {
    res.setHeader("Content-Type", "text/javascript; charset=utf8");
    const widget = loadWidget(req.query.id);

    let js = `
var shippingOptionsContainer = document.querySelector("#shipping-options-container");

function extendShipping() {
    if (!cartData || cartData.email !== "joel.a.villarreal@gmail.com") {
        return;
    }

    var widget = document.createElement("iframe");
    widget.src = "https://deliveryprice.now.sh/api/widget?id=${widget.config.id}";
    widget.frameBorder = "0";
    widget.frameSpacing = "0";
    widget.width = "100%";
    widget.height = 400;
    `;

    if (widget.config.integrations.tiendanube.autoselectShippingOption) {
        js += `

        function hideOptions() {
            var options = document.querySelectorAll("#shipping-options-container > div");
            for (var i = 0; i < options.length; i += 1) {
                options[i].style.display = "none";
            }    
        }
        hideOptions();

        window.addEventListener("message", function(event) {
            var payload = JSON.parse(event.data);
            if (!payload || !payload.dp) {
                return;
            }
    
            if (payload.dp.action === "selectShippingOption") {
                var optionID = payload.dp.data.matchingShippingOptionID;
                hideOptions();
                var option = document.querySelector(".option-" + optionID + " [type='radio']");
                option.parentElement.style.display = "block";
                option.click();
                return;
            }

            if (payload.dp.action === "requestShippingAddress") {
                var storeShippingAddress = JSON.stringify({ dp: { action: "storeShippingAddress", data: cartData.shippingAddress }});
                widget.contentWindow.postMessage(storeShippingAddress, "*");
                return;
            }
        });
        `;
    }

    js += `
    shippingOptionsContainer.appendChild(widget);
}

if (shippingOptionsContainer) {
    extendShipping();
}`;
    res.send(js);
};