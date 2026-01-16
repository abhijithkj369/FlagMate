from auth import get_password_hash, verify_password

try:
    print("Testing hash...")
    pwd = "password123"
    hashed = get_password_hash(pwd)
    print(f"Hashed: {hashed}")
    
    print("Testing verify...")
    is_valid = verify_password(pwd, hashed)
    print(f"Valid: {is_valid}")
    
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
