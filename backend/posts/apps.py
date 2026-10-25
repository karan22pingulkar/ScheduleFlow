from django.apps import AppConfig


class PostsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'posts'

    def ready(self):
        from decouple import config
        if config("ENABLE_INLINE_SCHEDULER", cast=bool, default=False):
            from . import scheduler
            scheduler.start()
