import requests
import time

BASE_URL = "http://localhost:8000"

def test_backend():
    # 1. Register User A
    print("Registering User A...")
    user_a = {
        "username": f"user_a_{int(time.time())}",
        "email": f"user_a_{int(time.time())}@example.com",
        "password": "password123"
    }
    res = requests.post(f"{BASE_URL}/register", json=user_a)
    if res.status_code != 200:
        print(f"Failed to register User A: {res.text}")
    assert res.status_code == 200
    user_a_data = res.json()
    print(f"User A registered: {user_a_data['username']}")

    # 2. Login User A
    print("Logging in User A...")
    res = requests.post(f"{BASE_URL}/token", data={"username": user_a['username'], "password": user_a['password']})
    if res.status_code != 200:
        print(f"Failed to login User A: {res.text}")
    assert res.status_code == 200
    token_a = res.json()['access_token']
    headers_a = {"Authorization": f"Bearer {token_a}"}

    # 3. Register User B
    print("Registering User B...")
    user_b = {
        "username": f"user_b_{int(time.time())}",
        "email": f"user_b_{int(time.time())}@example.com",
        "password": "password123"
    }
    res = requests.post(f"{BASE_URL}/register", json=user_b)
    if res.status_code != 200:
        print(f"Failed to register User B: {res.text}")
    assert res.status_code == 200
    user_b_data = res.json()
    print(f"User B registered: {user_b_data['username']}")

    # 4. Login User B
    print("Logging in User B...")
    res = requests.post(f"{BASE_URL}/token", data={"username": user_b['username'], "password": user_b['password']})
    if res.status_code != 200:
        print(f"Failed to login User B: {res.text}")
    assert res.status_code == 200
    token_b = res.json()['access_token']
    headers_b = {"Authorization": f"Bearer {token_b}"}

    # 5. Link Partners
    print("Linking partners...")
    # User A links to User B using B's link code
    res = requests.post(f"{BASE_URL}/link-partner", json={"link_code": user_b_data['link_code']}, headers=headers_a)
    if res.status_code != 200:
        print(f"Failed to link partners: {res.text}")
    assert res.status_code == 200
    print("Partners linked")

    # 6. Send Note from A to B
    print("Sending note from A...")
    res = requests.post(f"{BASE_URL}/notes", json={"content": "Hello from A"}, headers=headers_a)
    if res.status_code != 200:
        print(f"Failed to send note from A: {res.text}")
    assert res.status_code == 200
    print("Note sent from A")

    # 7. Send Note from B to A
    print("Sending note from B...")
    res = requests.post(f"{BASE_URL}/notes", json={"content": "Hello from B"}, headers=headers_b)
    if res.status_code != 200:
        print(f"Failed to send note from B: {res.text}")
    assert res.status_code == 200
    print("Note sent from B")

    # 8. Fetch Notes for A (Should see both)
    print("Fetching notes for A...")
    res = requests.get(f"{BASE_URL}/notes", headers=headers_a)
    if res.status_code != 200:
        print(f"Failed to fetch notes for A: {res.text}")
    assert res.status_code == 200
    notes = res.json()
    print(f"User A sees {len(notes)} notes")
    assert len(notes) == 2

    # 9. Log Data for A
    print("Logging data for A...")
    log_data = {
        "date": "2023-10-27",
        "green_flags": ["Good"],
        "red_flags": [],
        "mood": 8
    }
    res = requests.post(f"{BASE_URL}/logs", json=log_data, headers=headers_a)
    if res.status_code != 200:
        print(f"Failed to log data for A: {res.text}")
    assert res.status_code == 200
    print("Log created for A")

    # 10. Check Health Score
    print("Checking health score...")
    res = requests.get(f"{BASE_URL}/health-score", headers=headers_a)
    if res.status_code != 200:
        print(f"Failed to get health score: {res.text}")
    assert res.status_code == 200
    health = res.json()
    print(f"Health Score: {health['score']}")
    assert health['score'] > 0

    print("All tests passed!")

if __name__ == "__main__":
    try:
        test_backend()
    except Exception as e:
        print(f"Test failed: {repr(e)}")
