import pandas as pd
import sys

datasets = [
    ("data/global_weather_repo.csv", "Global Weather Repository"),
    ("data/rain_in_australia.csv", "Rain in Australia"),
    ("data/weather_history.csv", "Weather History"),
]

for filepath, name in datasets:
    print("=" * 80)
    print(f"DATASET: {name}")
    print(f"FILE: {filepath}")
    print("=" * 80)
    
    try:
        df = pd.read_csv(filepath)
        
        print(f"\n--- Shape ---")
        print(f"Rows: {df.shape[0]}, Columns: {df.shape[1]}")
        
        print(f"\n--- Columns ---")
        print(list(df.columns))
        
        print(f"\n--- Head (5 rows) ---")
        print(df.head().to_string())
        
        print(f"\n--- Info ---")
        df.info()
        
        print(f"\n--- Describe ---")
        print(df.describe().to_string())
        
        print(f"\n[OK] {name} loaded successfully!\n")
    except Exception as e:
        print(f"\n[FAIL] ERROR loading {name}: {e}\n")
        sys.exit(1)

print("\n" + "=" * 80)
print("ALL 3 DATASETS VERIFIED SUCCESSFULLY!")
print("=" * 80)
