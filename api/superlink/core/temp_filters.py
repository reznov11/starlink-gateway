from django import template

register = template.Library()


@register.filter(name='replace_string')
def replace_string(value: str, to_replace: str) -> str:
    return str(value).replace(to_replace, '_').upper()
