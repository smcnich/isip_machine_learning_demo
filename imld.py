import sys
import os

# Add the backend directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app', 'backend'))

from app import IMLD
from app.extensions.base import app

imld = IMLD()

if __name__ == '__main__':
    imld.run()