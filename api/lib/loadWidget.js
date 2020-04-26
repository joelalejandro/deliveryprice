import { readFileSync } from "fs";
import { resolve as resolvePath } from "path";
import widgetIndex from "../widgets/index.json";

export default function loadWidget(id) {
    const template = readFileSync(resolvePath(__dirname, "../template.html")).toString("utf8");
    const config = require(`../widgets/${widgetIndex[id]}/config.json`);

    return {
        template, config
    };
}