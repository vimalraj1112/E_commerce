# Gunicorn entry point for Render.
# `backend/app/` is a package named "app", so we load `backend/app.py` under a
# distinct module name to sidestep the clash, then expose the WSGI callable.
import importlib.util
import os
import sys

here = os.path.dirname(os.path.abspath(__file__))
if here not in sys.path:
    sys.path.insert(0, here)

spec = importlib.util.spec_from_file_location("mini_ecom_app", os.path.join(here, "app.py"))
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

app = mod.create_app()

if __name__ == "__main__":
    app.run(port=5000)