export default function shopName(widget) {
    widget.template = widget.template.replace(/%SHOP_NAME%/g, widget.config.shopName);
}