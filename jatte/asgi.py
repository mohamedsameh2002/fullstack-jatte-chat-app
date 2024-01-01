import os
from channels.auth import AuthMiddlewareStack
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter,URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from chat import routing
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jatte.settings')

django_asgi_application = get_asgi_application()
application=ProtocolTypeRouter(
    {
        'http':django_asgi_application,
        'websocket':AllowedHostsOriginValidator(
            AuthMiddlewareStack(URLRouter(routing.websocket_urlpatterns))
        )
    }
)