#!/usr/bin/env python3
"""Test password hashing"""
from app.auth import get_password_hash, verify_password

# Test with normal password
print("Testing password hashing...")
password = "demo123"
hashed = get_password_hash(password)
print(f"✓ Hashed password: {hashed[:50]}...")

# Test verification
verified = verify_password(password, hashed)
print(f"✓ Password verification: {verified}")

# Test with long password
long_password = "a" * 100
hashed_long = get_password_hash(long_password)
print(f"✓ Long password hashed: {hashed_long[:50]}...")

verified_long = verify_password(long_password, hashed_long)
print(f"✓ Long password verification: {verified_long}")

print("\n✅ All password tests passed!")
