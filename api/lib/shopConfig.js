export default function shopConfig(widget) {
    widget.template = widget.template.replace(/%SHOP_CONFIG%/g, `<script>var shopConfig = ${JSON.stringify(widget.config)};</script>`);
}