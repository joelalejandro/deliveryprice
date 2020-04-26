export default function shopLogo(widget) {
    if (widget.config.logo) {
        widget.template = widget.template.replace(/%SHOP_LOGO%/g, 
            `<img src="/api/widgets/${widget.config.shopDomain}/${widget.config.logo}`);
    } else {
        widget.template = widget.template.replace(/%SHOP_LOGO%/g, "");
    }
}