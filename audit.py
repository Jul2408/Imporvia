import os
import re
import json

def analyze_frontend(src_path):
    api_calls = []
    mocks = []
    
    api_pattern = re.compile(r'(fetch|axios\.(get|post|put|delete|patch))\s*\(\s*[`\'"](.*?)[`\'"]')
    mock_pattern = re.compile(r'(?i)(mock|fake|dummy|TODO|FIXME|hardcoded)')
    
    for root, dirs, files in os.walk(src_path):
        for file in files:
            if file.endswith(('.ts', '.tsx', '.js', '.jsx')):
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        lines = f.readlines()
                        for i, line in enumerate(lines):
                            api_match = api_pattern.search(line)
                            if api_match:
                                api_calls.append({
                                    'file': filepath.replace(src_path, ''),
                                    'line': i + 1,
                                    'call': api_match.group(3)
                                })
                            
                            mock_match = mock_pattern.search(line)
                            if mock_match:
                                mocks.append({
                                    'file': filepath.replace(src_path, ''),
                                    'line': i + 1,
                                    'match': mock_match.group(1),
                                    'content': line.strip()[:100]
                                })
                except Exception as e:
                    pass
                    
    return {'api_calls': api_calls, 'mocks': mocks}

def analyze_backend(backend_path):
    endpoints = []
    models = []
    
    for root, dirs, files in os.walk(backend_path):
        if 'venv' in root or '__pycache__' in root:
            continue
            
        for file in files:
            if file == 'urls.py':
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()
                        # simple extraction
                        paths = re.findall(r'path\([\'"](.*?)[\'"]', content)
                        endpoints.extend([{'file': filepath.replace(backend_path, ''), 'path': p} for p in paths])
                except:
                    pass
            elif file == 'models.py':
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()
                        class_names = re.findall(r'class\s+(\w+)\s*\(.*models\.Model.*\):', content)
                        models.extend([{'file': filepath.replace(backend_path, ''), 'model': m} for m in class_names])
                except:
                    pass
                    
    return {'endpoints': endpoints, 'models': models}

if __name__ == '__main__':
    frontend_res = analyze_frontend(r'd:\Projets\Douane\frontend\src')
    backend_res = analyze_backend(r'd:\Projets\Douane\backend')
    
    with open('audit_results.json', 'w') as f:
        json.dump({'frontend': frontend_res, 'backend': backend_res}, f, indent=2)
    
    print(f"Found {len(frontend_res['api_calls'])} API calls, {len(frontend_res['mocks'])} mocks in frontend.")
    print(f"Found {len(backend_res['endpoints'])} endpoints, {len(backend_res['models'])} models in backend.")
