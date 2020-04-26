import {readFileSync} from "fs";
import { resolve as resolvePath } from "path";

export default function shopCustomCSS(widget) {
    if (widget.config.customCSS) {
        widget.template = widget.template.replace(/%SHOP_CUSTOM_CSS%/g, 
            `<style>${readFileSync(resolvePath(__dirname, "../widgets/" + widget.config.shopDomain + "/styles.css")).toString("utf8")}</style>`);
    } else {
        widget.template = widget.template.replace(/%SHOP_CUSTOM_CSS%/g, "");
    }
}