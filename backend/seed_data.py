import os
import sys
from pymongo import MongoClient
from dotenv import load_dotenv

# Add backend to path to import models if needed, or just use raw pymongo
sys.path.append(os.path.join(os.getcwd(), 'backend'))

load_dotenv(os.path.join(os.path.dirname(__file__),'.env'))

def seed_products():
    mongo_uri = os.environ.get('MONGO_URI')
    if not mongo_uri:
        print("Error: MONGO_URI not found in .env")
        return

    client = MongoClient(mongo_uri)
    db_name = mongo_uri.split('/')[-1].split('?')[0] or 'mini_ecommerce'
    db = client[db_name]
    products_collection = db['products']

    # Clear existing products to start fresh (optional, but good for demo)
    # products_collection.delete_many({})

    new_products = [
        # Tech
        {"name": "Nova Pro Smartphone", "description": "Cutting-edge mobile performance with an advanced camera system.", "price": 999.0, "category": "Tech", "image_path": "backend/app/uploads/tech.png", "stock_quantity": 50},
        {"name": "Sonic Max Headphones", "description": "Pure sound with active noise cancellation and 40-hour battery life.", "price": 299.0, "category": "Tech", "image_path": "backend/app/uploads/tech.png", "stock_quantity": 100},
        {"name": "Aura Smart Watch", "description": "Track your health and stay connected with a stunning OLED display.", "price": 199.0, "category": "Tech", "image_path": "backend/app/uploads/tech.png", "stock_quantity": 75},
        {"name": "Ghost Wireless Keyboard", "description": "Mechanical precision in a sleek, travel-friendly wireless design.", "price": 129.0, "category": "Tech", "image_path": "backend/app/uploads/tech.png", "stock_quantity": 40},
        {"name": "Global Connect Adapter", "description": "The ultimate universal travel adapter with high-speed USB-C charging.", "price": 45.0, "category": "Tech", "image_path": "backend/app/uploads/tech.png", "stock_quantity": 200},
        
        # Fashion
        {"name": "Alpine Cashmere Sweater", "description": "Hand-spun luxury cashmere for unmatched warmth and softness.", "price": 150.0, "category": "Fashion", "image_path": "backend/app/uploads/fashion.png", "stock_quantity": 30},
        {"name": "Urban Craft Sneakers", "description": "Minimalist design meeting maximum durability in every step.", "price": 120.0, "category": "Fashion", "image_path": "backend/app/uploads/fashion.png", "stock_quantity": 60},
        {"name": "Heritage Leather Watch", "description": "Classic timepiece with a genuine Italian leather strap.", "price": 250.0, "category": "Fashion", "image_path": "backend/app/uploads/fashion.png", "stock_quantity": 20},
        {"name": "Azure Silk Scarf", "description": "Elegance defined in 100% pure Mulberry silk.", "price": 85.0, "category": "Fashion", "image_path": "backend/app/uploads/fashion.png", "stock_quantity": 45},
        {"name": "Obsidian Canvas Jacket", "description": "A versatile, wind-resistant outer layer for the modern explorer.", "price": 180.0, "category": "Fashion", "image_path": "backend/app/uploads/fashion.png", "stock_quantity": 35},

        # Home
        {"name": "Ethereal Ceramic Vase", "description": "Hand-molded minimalist piece for contemporary living spaces.", "price": 65.0, "category": "Home", "image_path": "backend/app/uploads/home.png", "stock_quantity": 25},
        {"name": "Twilight Scented Candle", "description": "Soy-based candle with notes of sandalwood and sea salt.", "price": 35.0, "category": "Home", "image_path": "backend/app/uploads/home.png", "stock_quantity": 100},
        {"name": "Cloud Linen Pillow Set", "description": "Breathable linen covers stuffed with ultra-soft down alternative.", "price": 95.0, "category": "Home", "image_path": "backend/app/uploads/home.png", "stock_quantity": 50},
        {"name": "Beam Modern Lamp", "description": "Adjustable warm LED lighting with a brushed metal finish.", "price": 110.0, "category": "Home", "image_path": "backend/app/uploads/home.png", "stock_quantity": 15},
        {"name": "Walnut Desk Organizer", "description": "Keep your workspace refined with this solid walnut station.", "price": 55.0, "category": "Home", "image_path": "backend/app/uploads/home.png", "stock_quantity": 40},

        # Lifestyle
        {"name": "Nomad Leather Backpack", "description": "Rugged yet refined leather travel companion for daily use.", "price": 220.0, "category": "Lifestyle", "image_path": "backend/app/uploads/lifestyle.png", "stock_quantity": 18},
        {"name": "Apex Stainless Bottle", "description": "Vacuum-insulated bottle keeping drinks cold for 24 hours.", "price": 40.0, "category": "Lifestyle", "image_path": "backend/app/uploads/lifestyle.png", "stock_quantity": 150},
        {"name": "Explorer Passport Holder", "description": "Slim leather sleeve for your essential travel documents.", "price": 30.0, "category": "Lifestyle", "image_path": "backend/app/uploads/lifestyle.png", "stock_quantity": 80},
        {"name": "Studio Premium Notebook", "description": "120gsm paper bound in a heavy linen hardcover.", "price": 25.0, "category": "Lifestyle", "image_path": "backend/app/uploads/lifestyle.png", "stock_quantity": 90},
        {"name": "Midnight Coffee Tumbler", "description": "Double-walled ceramic tumbler with a leak-proof lid.", "price": 32.0, "category": "Lifestyle", "image_path": "backend/app/uploads/lifestyle.png", "stock_quantity": 120}
    ]

    result = products_collection.insert_many(new_products)
    print(f"Successfully seeded {len(result.inserted_ids)} products into the database.")

if __name__ == "__main__":
    seed_products()
