#!/usr/bin/env python3
"""
AetherViz 小学教学 - 开发服务器
简单的 HTTP 服务器用于本地开发和测试
"""

import http.server
import socketserver
import os
import webbrowser
from pathlib import Path

PORT = 8080
DIRECTORY = Path(__file__).parent

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # 启用 CORS
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

def start_server():
    """启动开发服务器"""
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        print(f"🚀 AetherViz 开发服务器已启动")
        print(f"📍 地址: http://localhost:{PORT}")
        print(f"📁 目录: {DIRECTORY}")
        print(f"💡 按 Ctrl+C 停止服务器")
        print("-" * 50)

        # 自动打开浏览器
        url = f"http://localhost:{PORT}/templates/base-template.html"
        print(f"🌐 正在打开浏览器: {url}")
        webbrowser.open(url)

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n✋ 服务器已停止")
            httpd.server_close()

if __name__ == "__main__":
    start_server()
