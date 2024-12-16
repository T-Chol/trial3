class Config:
    """Base configuration."""
    SQLALCHEMY_DATABASE_URI = 'sqlite:///p4.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

# import os
# from dotenv import load_dotenv

# load_dotenv()

# class ProductionConfig(Config):
#     """Production configuration."""
#     SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')


