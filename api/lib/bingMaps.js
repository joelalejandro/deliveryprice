import axios from "axios";

export default async function bingMaps(widget) {
    const bingMapsScript = (await axios.get(`https://www.bing.com/api/maps/mapcontrol?key=${process.env.BING_API_KEY}&callback=init`)).data;
    widget.template = widget.template.replace(/%BING_MAPS%/g, `<script>${bingMapsScript}</script>`);
}