import {loadWidget, shopName, bingMaps, shopConfig, shopCustomCSS, shopLogo } from "./lib";

export default async (req, res) => {
    res.setHeader("Content-Type", "text/html; charset=utf8");
    res.setHeader("Cache-Control", "Cache-Control: s-maxage=1, stale-while-revalidate");

    let widget;
    
    try {
        widget = loadWidget(req.query.id);
    } catch {
        res.status(400);
        res.send("<h1>No data</h1>");
        return;
    }

    shopCustomCSS(widget);
    shopLogo(widget);
    shopName(widget);
    await bingMaps(widget);
    shopConfig(widget);

    res.status(200);
    res.send(widget.template);
};