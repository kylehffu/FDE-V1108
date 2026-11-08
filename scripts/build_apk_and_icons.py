#!/usr/bin/env python3
"""
Generates:
1. Compliant PWA PNG & SVG icons in public/:
   - public/icon.svg
   - public/pwa-192x192.png
   - public/pwa-512x512.png
   - public/pwa-maskable-512x512.png
   - public/apple-touch-icon.png (180x180)
2. A genuine, standalone, spec-compliant, signed Android APK:
   - public/FDE-Sales-Copilot-v2.0.apk
   Featuring 100% offline standalone embedded assets (file:///android_asset/index.html),
   adaptive hardware-accelerated WebView (JavaScript, DOMStorage, WideViewPort, OverviewMode,
   AllowFileAccess, AllowFileAccessFromFileURLs, AllowUniversalAccessFromFileURLs),
   Binary AXML AndroidManifest.xml, Dalvik classes.dex,
   RSA-2048 v1 (JAR Signature Scheme) + APK Signature Scheme v2.
"""

import os
import struct
import zlib
import hashlib
import base64
import subprocess
import tempfile
import zipfile

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(SCRIPT_DIR)
PUBLIC_DIR = os.path.join(PROJECT_DIR, "public")
DIST_DIR = os.path.join(PROJECT_DIR, "dist")
os.makedirs(PUBLIC_DIR, exist_ok=True)

APP_URL = "file:///android_asset/index.html"


# ==============================================================================
# PART 1: Generate Crisp PNG Icons & Brand SVG
# ==============================================================================
def write_svg_icon(path: str):
    svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#020617"/>
      <stop offset="50%" stop-color="#091e3a"/>
      <stop offset="100%" stop-color="#022c44"/>
    </linearGradient>
    <linearGradient id="cyan-glow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#22d3ee"/>
      <stop offset="100%" stop-color="#06b6d4"/>
    </linearGradient>
    <linearGradient id="blue-edge" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#2563eb"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="112" fill="url(#bg)"/>
  <circle cx="256" cy="256" r="180" fill="none" stroke="#0e7490" stroke-width="2" stroke-dasharray="8 8" opacity="0.4"/>
  <circle cx="256" cy="256" r="120" fill="none" stroke="#22d3ee" stroke-width="2" opacity="0.3"/>
  <line x1="256" y1="120" x2="170" y2="210" stroke="url(#blue-edge)" stroke-width="3" stroke-linecap="round" opacity="0.8"/>
  <line x1="256" y1="120" x2="342" y2="210" stroke="url(#blue-edge)" stroke-width="3" stroke-linecap="round" opacity="0.8"/>
  <line x1="170" y1="210" x2="200" y2="330" stroke="url(#blue-edge)" stroke-width="3" stroke-linecap="round" opacity="0.8"/>
  <line x1="342" y1="210" x2="312" y2="330" stroke="url(#blue-edge)" stroke-width="3" stroke-linecap="round" opacity="0.8"/>
  <line x1="200" y1="330" x2="312" y2="330" stroke="url(#blue-edge)" stroke-width="3" stroke-linecap="round" opacity="0.8"/>
  <line x1="170" y1="210" x2="256" y2="256" stroke="#22d3ee" stroke-width="2.5" opacity="0.9"/>
  <line x1="342" y1="210" x2="256" y2="256" stroke="#22d3ee" stroke-width="2.5" opacity="0.9"/>
  <line x1="200" y1="330" x2="256" y2="256" stroke="#22d3ee" stroke-width="2.5" opacity="0.9"/>
  <line x1="312" y1="330" x2="256" y2="256" stroke="#22d3ee" stroke-width="2.5" opacity="0.9"/>
  <line x1="256" y1="120" x2="256" y2="256" stroke="#22d3ee" stroke-width="3" opacity="0.9"/>
  <circle cx="256" cy="120" r="18" fill="url(#cyan-glow)"/>
  <circle cx="170" cy="210" r="15" fill="#38bdf8"/>
  <circle cx="342" cy="210" r="15" fill="#38bdf8"/>
  <circle cx="200" cy="330" r="15" fill="#0284c7"/>
  <circle cx="312" cy="330" r="15" fill="#0284c7"/>
  <circle cx="256" cy="256" r="26" fill="url(#cyan-glow)"/>
  <path d="M256 244 L259 253 L268 256 L259 259 L256 268 L253 259 L244 256 L253 253 Z" fill="#ffffff"/>
  <text x="256" y="420" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="36" font-weight="800" fill="#22d3ee" text-anchor="middle" letter-spacing="4">FDE 销售参谋</text>
  <text x="256" y="454" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="600" fill="#94a3b8" text-anchor="middle" letter-spacing="2">全行业 2B 顾问式作战底座</text>
</svg>
"""
    with open(path, "w", encoding="utf-8") as f:
        f.write(svg)


def create_png(width: int, height: int, maskable: bool = False) -> bytes:
    raw_data = bytearray()
    cx, cy = width / 2.0, height / 2.0
    r_outer = min(width, height) * (0.38 if maskable else 0.44)
    ring_thick = max(1.5, width * 0.008)

    nodes = [
        (cx, cy - r_outer * 0.68, 0.07),
        (cx - r_outer * 0.55, cy - r_outer * 0.15, 0.055),
        (cx + r_outer * 0.55, cy - r_outer * 0.15, 0.055),
        (cx - r_outer * 0.35, cy + r_outer * 0.55, 0.055),
        (cx + r_outer * 0.35, cy + r_outer * 0.55, 0.055),
        (cx, cy, 0.10),
    ]

    edges = [
        (nodes[0][0], nodes[0][1], nodes[1][0], nodes[1][1]),
        (nodes[0][0], nodes[0][1], nodes[2][0], nodes[2][1]),
        (nodes[1][0], nodes[1][1], nodes[3][0], nodes[3][1]),
        (nodes[2][0], nodes[2][1], nodes[4][0], nodes[4][1]),
        (nodes[3][0], nodes[3][1], nodes[4][0], nodes[4][1]),
        (nodes[0][0], nodes[0][1], nodes[5][0], nodes[5][1]),
        (nodes[1][0], nodes[1][1], nodes[5][0], nodes[5][1]),
        (nodes[2][0], nodes[2][1], nodes[5][0], nodes[5][1]),
        (nodes[3][0], nodes[3][1], nodes[5][0], nodes[5][1]),
        (nodes[4][0], nodes[4][1], nodes[5][0], nodes[5][1]),
    ]

    for y in range(height):
        raw_data.append(0)  # filter type None
        ny = y / float(height)
        for x in range(width):
            nx = x / float(width)
            r = int(2 + 12 * nx + 6 * ny)
            g = int(6 + 24 * nx + 38 * ny)
            b = int(23 + 35 * nx + 45 * ny)

            dist_center = ((x - cx) ** 2 + (y - cy) ** 2) ** 0.5
            if abs(dist_center - r_outer * 0.85) < ring_thick * 0.7:
                r, g, b = 14, 116, 144

            for x1, y1, x2, y2 in edges:
                dx, dy = x2 - x1, y2 - y1
                seg_len2 = dx * dx + dy * dy
                if seg_len2 > 0:
                    t = max(0.0, min(1.0, ((x - x1) * dx + (y - y1) * dy) / seg_len2))
                    proj_x = x1 + t * dx
                    proj_y = y1 + t * dy
                    d = ((x - proj_x) ** 2 + (y - proj_y) ** 2) ** 0.5
                    if d < ring_thick * 0.8:
                        r, g, b = 34, 211, 238

            for nx_c, ny_c, nr_scale in nodes:
                nr = r_outer * nr_scale
                d = ((x - nx_c) ** 2 + (y - ny_c) ** 2) ** 0.5
                if d <= nr:
                    if (nx_c, ny_c) == (cx, cy):
                        if d <= nr * 0.3:
                            r, g, b = 255, 255, 255
                        else:
                            r, g, b = 34, 211, 238
                    else:
                        r, g, b = 56, 189, 248

            raw_data.extend((r & 0xFF, g & 0xFF, b & 0xFF, 255))

    compressed = zlib.compress(bytes(raw_data), 9)

    def png_chunk(tag: bytes, data: bytes) -> bytes:
        return struct.pack(">I", len(data)) + tag + data + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)

    ihdr = struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0)
    return b"\x89PNG\r\n\x1a\n" + png_chunk(b"IHDR", ihdr) + png_chunk(b"IDAT", compressed) + png_chunk(b"IEND", b"")


# ==============================================================================
# PART 2: Build Android Binary XML (AXML)
# ==============================================================================
def build_binary_axml() -> bytes:
    res_attr_strings = [
        "theme",
        "label",
        "name",
        "exported",
        "configChanges",
        "minSdkVersion",
        "versionCode",
        "targetSdkVersion",
        "hardwareAccelerated",
        "usesCleartextTraffic",
    ]
    res_ids = [
        0x01010001,
        0x01010003,
        0x01010010,
        0x0101001f,
        0x0101020c,
        0x0101021b,
        0x0101021c,
        0x01010270,
        0x010102d3,
        0x010104ec,
    ]

    other_strings = [
        "android",
        "http://schemas.android.com/apk/res/android",
        "",
        "manifest",
        "package",
        "com.fde.salescopilot",
        "2.0.0",
        "uses-sdk",
        "uses-permission",
        "android.permission.INTERNET",
        "application",
        "FDE 随身销售参谋",
        "activity",
        "com.fde.salescopilot.MainActivity",
        "intent-filter",
        "action",
        "android.intent.action.MAIN",
        "category",
        "android.intent.category.LAUNCHER",
    ]

    all_strings = res_attr_strings + other_strings
    idx = {s: i for i, s in enumerate(all_strings)}

    encoded_strings = []
    offsets = []
    cur_offset = 0
    for s in all_strings:
        u16 = s.encode("utf-16le")
        char_len = len(s)
        entry = struct.pack("<H", char_len) + u16 + b"\x00\x00"
        offsets.append(cur_offset)
        encoded_strings.append(entry)
        cur_offset += len(entry)

    strings_blob = b"".join(encoded_strings)
    while len(strings_blob) % 4 != 0:
        strings_blob += b"\x00"

    string_count = len(all_strings)
    header_size = 28
    strings_start = header_size + 4 * string_count
    pool_chunk_size = strings_start + len(strings_blob)

    string_pool_chunk = (
        struct.pack(
            "<HHIIIII",
            0x0001,
            header_size,
            pool_chunk_size,
            string_count,
            0,
            0,
            strings_start,
        )
        + struct.pack("<I", 0)
        + b"".join(struct.pack("<I", o) for o in offsets)
        + strings_blob
    )

    res_map_data = b"".join(struct.pack("<I", rid) for rid in res_ids)
    res_map_chunk = struct.pack("<HHI", 0x0180, 8, 8 + len(res_map_data)) + res_map_data

    xml_chunks = []

    def start_ns(prefix_idx: int, uri_idx: int, line: int = 1) -> bytes:
        return struct.pack("<HHIIII", 0x0100, 16, 24, line, 0xFFFFFFFF, prefix_idx) + struct.pack("<I", uri_idx)

    def end_ns(prefix_idx: int, uri_idx: int, line: int = 20) -> bytes:
        return struct.pack("<HHIIII", 0x0101, 16, 24, line, 0xFFFFFFFF, prefix_idx) + struct.pack("<I", uri_idx)

    def start_elem(name_idx: int, attrs: list, line: int = 1) -> bytes:
        attr_data = b""
        for uri_id, name_id, raw_str_id, typed_val in attrs:
            attr_data += struct.pack("<III", uri_id, name_id, raw_str_id & 0xFFFFFFFF) + typed_val
        chunk_len = 36 + len(attr_data)
        return struct.pack(
            "<HHIIIIHHHHHH",
            0x0102,
            36,
            chunk_len,
            line,
            0xFFFFFFFF,
            0xFFFFFFFF,
            name_idx,
            0x0014,
            20,
            len(attrs),
            0,
            0,
        ) + attr_data

    def end_elem(name_idx: int, line: int = 1) -> bytes:
        return struct.pack("<HHIIIIII", 0x0103, 16, 24, line, 0xFFFFFFFF, 0xFFFFFFFF, name_idx, 0)

    def val_string(str_idx: int) -> bytes:
        return struct.pack("<HBBI", 8, 0, 0x03, str_idx)

    def val_int(num: int) -> bytes:
        return struct.pack("<HBBI", 8, 0, 0x10, num)

    def val_bool(b: bool) -> bytes:
        return struct.pack("<HBBI", 8, 0, 0x12, 0xFFFFFFFF if b else 0)

    def val_hex(h: int) -> bytes:
        return struct.pack("<HBBI", 8, 0, 0x11, h)

    def val_ref(r: int) -> bytes:
        return struct.pack("<HBBI", 8, 0, 0x01, r)

    xml_chunks.append(start_ns(idx["android"], idx["http://schemas.android.com/apk/res/android"], 1))

    manifest_attrs = [
        (idx["http://schemas.android.com/apk/res/android"], idx["versionCode"], 0xFFFFFFFF, val_int(200)),
        (0xFFFFFFFF, idx["package"], idx["com.fde.salescopilot"], val_string(idx["com.fde.salescopilot"])),
    ]
    xml_chunks.append(start_elem(idx["manifest"], manifest_attrs, 2))

    sdk_attrs = [
        (idx["http://schemas.android.com/apk/res/android"], idx["minSdkVersion"], 0xFFFFFFFF, val_int(21)),
        (idx["http://schemas.android.com/apk/res/android"], idx["targetSdkVersion"], 0xFFFFFFFF, val_int(34)),
    ]
    xml_chunks.append(start_elem(idx["uses-sdk"], sdk_attrs, 3))
    xml_chunks.append(end_elem(idx["uses-sdk"], 3))

    perm_attrs = [
        (idx["http://schemas.android.com/apk/res/android"], idx["name"], idx["android.permission.INTERNET"], val_string(idx["android.permission.INTERNET"])),
    ]
    xml_chunks.append(start_elem(idx["uses-permission"], perm_attrs, 4))
    xml_chunks.append(end_elem(idx["uses-permission"], 4))

    app_attrs = [
        (idx["http://schemas.android.com/apk/res/android"], idx["label"], idx["FDE 随身销售参谋"], val_string(idx["FDE 随身销售参谋"])),
        (idx["http://schemas.android.com/apk/res/android"], idx["hardwareAccelerated"], 0xFFFFFFFF, val_bool(True)),
        (idx["http://schemas.android.com/apk/res/android"], idx["usesCleartextTraffic"], 0xFFFFFFFF, val_bool(True)),
        (idx["http://schemas.android.com/apk/res/android"], idx["theme"], 0xFFFFFFFF, val_ref(0x01030007)),
    ]
    xml_chunks.append(start_elem(idx["application"], app_attrs, 5))

    act_attrs = [
        (idx["http://schemas.android.com/apk/res/android"], idx["name"], idx["com.fde.salescopilot.MainActivity"], val_string(idx["com.fde.salescopilot.MainActivity"])),
        (idx["http://schemas.android.com/apk/res/android"], idx["exported"], 0xFFFFFFFF, val_bool(True)),
        (idx["http://schemas.android.com/apk/res/android"], idx["configChanges"], 0xFFFFFFFF, val_hex(0x0DB0)),
    ]
    xml_chunks.append(start_elem(idx["activity"], act_attrs, 6))

    xml_chunks.append(start_elem(idx["intent-filter"], [], 7))
    act_name_attrs = [
        (idx["http://schemas.android.com/apk/res/android"], idx["name"], idx["android.intent.action.MAIN"], val_string(idx["android.intent.action.MAIN"])),
    ]
    xml_chunks.append(start_elem(idx["action"], act_name_attrs, 8))
    xml_chunks.append(end_elem(idx["action"], 8))

    cat_name_attrs = [
        (idx["http://schemas.android.com/apk/res/android"], idx["name"], idx["android.intent.category.LAUNCHER"], val_string(idx["android.intent.category.LAUNCHER"])),
    ]
    xml_chunks.append(start_elem(idx["category"], cat_name_attrs, 9))
    xml_chunks.append(end_elem(idx["category"], 9))
    xml_chunks.append(end_elem(idx["intent-filter"], 10))

    xml_chunks.append(end_elem(idx["activity"], 11))
    xml_chunks.append(end_elem(idx["application"], 12))
    xml_chunks.append(end_elem(idx["manifest"], 13))
    xml_chunks.append(end_ns(idx["android"], idx["http://schemas.android.com/apk/res/android"], 14))

    body_bytes = string_pool_chunk + res_map_chunk + b"".join(xml_chunks)
    total_file_size = 8 + len(body_bytes)
    file_header = struct.pack("<HHI", 0x0003, 8, total_file_size)
    return file_header + body_bytes


# ==============================================================================
# PART 3: Build Dalvik Executable (classes.dex)
# ==============================================================================
def build_classes_dex(app_url: str) -> bytes:
    raw_strings = [
        "<init>",
        "L",
        "Landroid/app/Activity;",
        "Landroid/content/Context;",
        "Landroid/os/Bundle;",
        "Landroid/view/View;",
        "Landroid/webkit/WebSettings;",
        "Landroid/webkit/WebView;",
        "Landroid/webkit/WebViewClient;",
        "Lcom/fde/salescopilot/MainActivity;",
        "V",
        "VL",
        "VZ",
        "Z",
        "getSettings",
        app_url,
        "loadUrl",
        "onCreate",
        "setContentView",
        "setDomStorageEnabled",
        "setJavaScriptEnabled",
        "setLoadWithOverviewMode",
        "setUseWideViewPort",
        "setAllowFileAccess",
        "setAllowContentAccess",
        "setAllowFileAccessFromFileURLs",
        "setAllowUniversalAccessFromFileURLs",
        "setWebViewClient",
    ]
    type_names = [
        "Landroid/app/Activity;",
        "Landroid/content/Context;",
        "Landroid/os/Bundle;",
        "Landroid/view/View;",
        "Landroid/webkit/WebSettings;",
        "Landroid/webkit/WebView;",
        "Landroid/webkit/WebViewClient;",
        "Lcom/fde/salescopilot/MainActivity;",
        "Ljava/lang/String;",
        "V",
        "Z",
    ]
    strings = sorted(set(raw_strings + type_names + ["Ljava/lang/String;"]))
    s_idx = {s: i for i, s in enumerate(strings)}

    types = sorted(type_names)
    t_idx = {t: i for i, t in enumerate(types)}

    proto_defs = [
        ("L", "Landroid/webkit/WebSettings;", []),
        ("V", "V", []),
        ("VL", "V", ["Landroid/content/Context;"]),
        ("VL", "V", ["Landroid/os/Bundle;"]),
        ("VL", "V", ["Landroid/view/View;"]),
        ("VL", "V", ["Landroid/webkit/WebViewClient;"]),
        ("VL", "V", ["Ljava/lang/String;"]),
        ("VZ", "V", ["Z"]),
    ]
    proto_defs.sort(key=lambda p: (t_idx[p[1]], [t_idx[x] for x in p[2]]))
    p_idx = {(p[1], tuple(p[2])): i for i, p in enumerate(proto_defs)}

    method_defs = [
        ("Landroid/app/Activity;", "<init>", "V", ()),
        ("Landroid/app/Activity;", "onCreate", "V", ("Landroid/os/Bundle;",)),
        ("Landroid/app/Activity;", "setContentView", "V", ("Landroid/view/View;",)),
        ("Landroid/webkit/WebSettings;", "setAllowContentAccess", "V", ("Z",)),
        ("Landroid/webkit/WebSettings;", "setAllowFileAccess", "V", ("Z",)),
        ("Landroid/webkit/WebSettings;", "setAllowFileAccessFromFileURLs", "V", ("Z",)),
        ("Landroid/webkit/WebSettings;", "setAllowUniversalAccessFromFileURLs", "V", ("Z",)),
        ("Landroid/webkit/WebSettings;", "setDomStorageEnabled", "V", ("Z",)),
        ("Landroid/webkit/WebSettings;", "setJavaScriptEnabled", "V", ("Z",)),
        ("Landroid/webkit/WebSettings;", "setLoadWithOverviewMode", "V", ("Z",)),
        ("Landroid/webkit/WebSettings;", "setUseWideViewPort", "V", ("Z",)),
        ("Landroid/webkit/WebView;", "<init>", "V", ("Landroid/content/Context;",)),
        ("Landroid/webkit/WebView;", "getSettings", "Landroid/webkit/WebSettings;", ()),
        ("Landroid/webkit/WebView;", "loadUrl", "V", ("Ljava/lang/String;",)),
        ("Landroid/webkit/WebView;", "setWebViewClient", "V", ("Landroid/webkit/WebViewClient;",)),
        ("Landroid/webkit/WebViewClient;", "<init>", "V", ()),
        ("Lcom/fde/salescopilot/MainActivity;", "<init>", "V", ()),
        ("Lcom/fde/salescopilot/MainActivity;", "onCreate", "V", ("Landroid/os/Bundle;",)),
    ]
    method_defs.sort(key=lambda m: (t_idx[m[0]], s_idx[m[1]], p_idx[(m[2], m[3])]))
    m_idx = {(m[0], m[1], m[2], m[3]): i for i, m in enumerate(method_defs)}

    m_act_init = m_idx[("Landroid/app/Activity;", "<init>", "V", ())]
    insns_init = struct.pack("<HHH", 0x1070, m_act_init, 0x0000) + struct.pack("<H", 0x000E)
    code_init = struct.pack("<HHHHII", 1, 1, 1, 0, 0, len(insns_init) // 2) + insns_init

    m_super_oncreate = m_idx[("Landroid/app/Activity;", "onCreate", "V", ("Landroid/os/Bundle;",))]
    m_wv_init = m_idx[("Landroid/webkit/WebView;", "<init>", "V", ("Landroid/content/Context;",))]
    m_wv_settings = m_idx[("Landroid/webkit/WebView;", "getSettings", "Landroid/webkit/WebSettings;", ())]
    m_ws_js = m_idx[("Landroid/webkit/WebSettings;", "setJavaScriptEnabled", "V", ("Z",))]
    m_ws_dom = m_idx[("Landroid/webkit/WebSettings;", "setDomStorageEnabled", "V", ("Z",))]
    m_ws_wide = m_idx[("Landroid/webkit/WebSettings;", "setUseWideViewPort", "V", ("Z",))]
    m_ws_overview = m_idx[("Landroid/webkit/WebSettings;", "setLoadWithOverviewMode", "V", ("Z",))]
    m_ws_file = m_idx[("Landroid/webkit/WebSettings;", "setAllowFileAccess", "V", ("Z",))]
    m_ws_content = m_idx[("Landroid/webkit/WebSettings;", "setAllowContentAccess", "V", ("Z",))]
    m_ws_file_urls = m_idx[("Landroid/webkit/WebSettings;", "setAllowFileAccessFromFileURLs", "V", ("Z",))]
    m_ws_univ_urls = m_idx[("Landroid/webkit/WebSettings;", "setAllowUniversalAccessFromFileURLs", "V", ("Z",))]
    m_wvc_init = m_idx[("Landroid/webkit/WebViewClient;", "<init>", "V", ())]
    m_wv_client = m_idx[("Landroid/webkit/WebView;", "setWebViewClient", "V", ("Landroid/webkit/WebViewClient;",))]
    m_wv_load = m_idx[("Landroid/webkit/WebView;", "loadUrl", "V", ("Ljava/lang/String;",))]
    m_act_content = m_idx[("Landroid/app/Activity;", "setContentView", "V", ("Landroid/view/View;",))]

    t_wv = t_idx["Landroid/webkit/WebView;"]
    t_wvc = t_idx["Landroid/webkit/WebViewClient;"]
    s_url = s_idx[app_url]

    insns_oncreate = b"".join([
        struct.pack("<HHH", 0x206F, m_super_oncreate, 0x0043),
        struct.pack("<HH", 0x0022, t_wv),
        struct.pack("<HHH", 0x2070, m_wv_init, 0x0030),
        struct.pack("<HHH", 0x106E, m_wv_settings, 0x0000),
        struct.pack("<H", 0x010C),
        struct.pack("<H", 0x1212),
        struct.pack("<HHH", 0x206E, m_ws_js, 0x0021),
        struct.pack("<HHH", 0x206E, m_ws_dom, 0x0021),
        struct.pack("<HHH", 0x206E, m_ws_wide, 0x0021),
        struct.pack("<HHH", 0x206E, m_ws_overview, 0x0021),
        struct.pack("<HHH", 0x206E, m_ws_file, 0x0021),
        struct.pack("<HHH", 0x206E, m_ws_content, 0x0021),
        struct.pack("<HHH", 0x206E, m_ws_file_urls, 0x0021),
        struct.pack("<HHH", 0x206E, m_ws_univ_urls, 0x0021),
        struct.pack("<HH", 0x0122, t_wvc),
        struct.pack("<HHH", 0x1070, m_wvc_init, 0x0001),
        struct.pack("<HHH", 0x206E, m_wv_client, 0x0010),
        struct.pack("<HH", 0x011A, s_url),
        struct.pack("<HHH", 0x206E, m_wv_load, 0x0010),
        struct.pack("<HHH", 0x206E, m_act_content, 0x0003),
        struct.pack("<H", 0x000E),
    ])
    code_oncreate = struct.pack("<HHHHII", 5, 2, 2, 0, 0, len(insns_oncreate) // 2) + insns_oncreate

    off_string_ids = 0x70
    off_type_ids = off_string_ids + 4 * len(strings)
    off_proto_ids = off_type_ids + 4 * len(types)
    off_method_ids = off_proto_ids + 12 * len(proto_defs)
    off_class_defs = off_method_ids + 8 * len(method_defs)
    off_data = off_class_defs + 32

    data_buf = bytearray()
    def align4():
        while (off_data + len(data_buf)) % 4 != 0:
            data_buf.append(0)

    proto_param_offs = []
    for shorty, ret_t, params in proto_defs:
        if not params:
            proto_param_offs.append(0)
        else:
            align4()
            proto_param_offs.append(off_data + len(data_buf))
            data_buf += struct.pack("<I", len(params))
            for p in params:
                data_buf += struct.pack("<H", t_idx[p])

    def encode_uleb128(val: int) -> bytes:
        out = bytearray()
        while True:
            byte = val & 0x7F
            val >>= 7
            if val != 0:
                byte |= 0x80
            out.append(byte)
            if val == 0:
                break
        return bytes(out)

    string_data_offs = []
    for s in strings:
        utf8 = s.encode("utf-8")
        entry = encode_uleb128(len(s)) + utf8 + b"\x00"
        string_data_offs.append(off_data + len(data_buf))
        data_buf += entry

    align4()
    off_code_init = off_data + len(data_buf)
    data_buf += code_init

    align4()
    off_code_oncreate = off_data + len(data_buf)
    data_buf += code_oncreate

    align4()
    off_class_data = off_data + len(data_buf)
    m_main_init = m_idx[("Lcom/fde/salescopilot/MainActivity;", "<init>", "V", ())]
    m_main_oncreate = m_idx[("Lcom/fde/salescopilot/MainActivity;", "onCreate", "V", ("Landroid/os/Bundle;",))]

    class_data_bytes = (
        encode_uleb128(0)
        + encode_uleb128(0)
        + encode_uleb128(2)
        + encode_uleb128(0)
        + encode_uleb128(m_main_init)
        + encode_uleb128(0x10001)
        + encode_uleb128(off_code_init)
        + encode_uleb128(m_main_oncreate - m_main_init)
        + encode_uleb128(0x0004)
        + encode_uleb128(off_code_oncreate)
    )
    data_buf += class_data_bytes

    data_size = len(data_buf)
    file_size = off_data + data_size

    string_ids = b"".join(struct.pack("<I", off) for off in string_data_offs)
    type_ids = b"".join(struct.pack("<I", s_idx[t]) for t in types)
    proto_ids = b"".join(
        struct.pack("<III", s_idx[shorty], t_idx[ret_t], proto_param_offs[i])
        for i, (shorty, ret_t, params) in enumerate(proto_defs)
    )
    method_ids = b"".join(
        struct.pack("<HHI", t_idx[cls_t], p_idx[(ret_t, tuple(params))], s_idx[name])
        for cls_t, name, ret_t, params in method_defs
    )
    class_def = struct.pack(
        "<IIIIIIII",
        t_idx["Lcom/fde/salescopilot/MainActivity;"],
        0x0001,
        t_idx["Landroid/app/Activity;"],
        0,
        s_idx["Lcom/fde/salescopilot/MainActivity;"],
        0,
        off_class_data,
        0,
    )

    header = bytearray(0x70)
    header[0:8] = b"dex\n035\x00"
    struct.pack_into("<I", header, 0x20, file_size)
    struct.pack_into("<I", header, 0x24, 0x70)
    struct.pack_into("<I", header, 0x28, 0x12345678)

    struct.pack_into("<II", header, 0x38, len(strings), off_string_ids)
    struct.pack_into("<II", header, 0x40, len(types), off_type_ids)
    struct.pack_into("<II", header, 0x48, len(proto_defs), off_proto_ids)
    struct.pack_into("<II", header, 0x58, len(method_defs), off_method_ids)
    struct.pack_into("<II", header, 0x60, 1, off_class_defs)
    struct.pack_into("<II", header, 0x68, data_size, off_data)

    payload_before_sig = (
        string_ids
        + type_ids
        + proto_ids
        + method_ids
        + class_def
        + bytes(data_buf)
    )
    full_for_sig = header[32:] + payload_before_sig
    sig = hashlib.sha1(full_for_sig).digest()
    header[12:32] = sig

    chk = zlib.adler32(header[12:] + payload_before_sig) & 0xFFFFFFFF
    struct.pack_into("<I", header, 8, chk)

    return bytes(header) + payload_before_sig


# ==============================================================================
# PART 4: Build & Sign Standalone APK (v1 JAR Signature + APK Signature Scheme v2)
# ==============================================================================
def sign_and_build_apk(apk_out_path: str):
    axml_bytes = build_binary_axml()
    dex_bytes = build_classes_dex(APP_URL)

    # Collect all dist files to embed into assets/
    asset_files = []
    if os.path.exists(DIST_DIR):
        for root, _, filenames in os.walk(DIST_DIR):
            for f in filenames:
                if f.endswith(".apk") or f.endswith(".zip") or f.endswith(".tar.gz"):
                    continue
                full_path = os.path.join(root, f)
                rel_path = os.path.relpath(full_path, DIST_DIR)
                zip_entry_name = f"assets/{rel_path}"
                with open(full_path, "rb") as fp:
                    asset_files.append((zip_entry_name, fp.read()))
    else:
        print(f"Warning: {DIST_DIR} not found, APK will have minimal assets")

    with tempfile.TemporaryDirectory() as tmpdir:
        key_pem = os.path.join(tmpdir, "key.pem")
        cert_pem = os.path.join(tmpdir, "cert.pem")
        cert_der = os.path.join(tmpdir, "cert.der")

        # Generate RSA-2048 signing key and X.509 certificate
        subprocess.run(
            [
                "openssl", "req", "-x509", "-newkey", "rsa:2048",
                "-keyout", key_pem, "-out", cert_pem,
                "-days", "10000", "-nodes",
                "-subj", "/CN=FDE Sales Copilot/OU=Mobile/O=FDE Intelligence/L=Shenzhen/ST=GD/C=CN",
            ],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        subprocess.run(
            ["openssl", "x509", "-in", cert_pem, "-outform", "DER", "-out", cert_der],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )

        # Build v1 JAR Signature entries for AndroidManifest.xml, classes.dex, and all assets/*
        manifest_entries = []
        sf_entries = []

        all_zip_payloads = [
            ("AndroidManifest.xml", axml_bytes),
            ("classes.dex", dex_bytes),
        ] + asset_files

        for entry_name, data in all_zip_payloads:
            b64 = base64.b64encode(hashlib.sha256(data).digest()).decode("ascii")
            mf_chunk = f"Name: {entry_name}\r\nSHA-256-Digest: {b64}\r\n\r\n".encode("utf-8")
            manifest_entries.append(mf_chunk)

            chunk_digest = base64.b64encode(hashlib.sha256(mf_chunk).digest()).decode("ascii")
            sf_chunk = f"Name: {entry_name}\r\nSHA-256-Digest: {chunk_digest}\r\n\r\n".encode("utf-8")
            sf_entries.append(sf_chunk)

        manifest_header = b"Manifest-Version: 1.0\r\nCreated-By: 1.0 (Android)\r\n\r\n"
        manifest_mf = manifest_header + b"".join(manifest_entries)

        main_digest = base64.b64encode(hashlib.sha256(manifest_mf).digest()).decode("ascii")
        cert_sf = (
            f"Signature-Version: 1.0\r\n"
            f"Created-By: 1.0 (Android)\r\n"
            f"SHA-256-Digest-Manifest: {main_digest}\r\n"
            f"X-Android-APK-Signed: 2\r\n\r\n"
        ).encode("utf-8") + b"".join(sf_entries)

        sf_path = os.path.join(tmpdir, "CERT.SF")
        rsa_path = os.path.join(tmpdir, "CERT.RSA")
        with open(sf_path, "wb") as f:
            f.write(cert_sf)

        subprocess.run(
            [
                "openssl", "cms", "-sign", "-binary", "-noattr",
                "-in", sf_path, "-signer", cert_pem, "-inkey", key_pem,
                "-outform", "DER", "-out", rsa_path, "-md", "sha256",
            ],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        with open(rsa_path, "rb") as f:
            cert_rsa = f.read()

        # Build full unsigned APK with assets
        unsigned_zip_path = os.path.join(tmpdir, "base.apk")
        with zipfile.ZipFile(unsigned_zip_path, "w", compression=zipfile.ZIP_DEFLATED) as zf:
            for entry_name, data in all_zip_payloads:
                zf.writestr(entry_name, data)
            zf.writestr("META-INF/MANIFEST.MF", manifest_mf)
            zf.writestr("META-INF/CERT.SF", cert_sf)
            zf.writestr("META-INF/CERT.RSA", cert_rsa)

        with open(unsigned_zip_path, "rb") as f:
            zip_bytes = f.read()

        # Locate End of Central Directory (EOCD) and Central Directory offset
        eocd_pos = zip_bytes.rfind(b"PK\x05\x06")
        cd_size = struct.unpack("<I", zip_bytes[eocd_pos + 12 : eocd_pos + 16])[0]
        cd_offset = struct.unpack("<I", zip_bytes[eocd_pos + 16 : eocd_pos + 20])[0]

        before_cd = zip_bytes[:cd_offset]
        cd_bytes = zip_bytes[cd_offset:eocd_pos]
        eocd_bytes = bytearray(zip_bytes[eocd_pos:])

        # Compute APK Signature Scheme v2 digest
        def chunk_digests(sections):
            chunk_hashes = []
            total_chunks = 0
            for sec in sections:
                pos = 0
                while pos < len(sec):
                    chunk = sec[pos : pos + 1048576]
                    pos += len(chunk)
                    total_chunks += 1
                    h = hashlib.sha256(b"\xa5" + struct.pack("<I", len(chunk)) + chunk).digest()
                    chunk_hashes.append(h)
            top_input = b"\x5a" + struct.pack("<I", total_chunks) + b"".join(chunk_hashes)
            return hashlib.sha256(top_input).digest()

        eocd_for_hash = bytearray(eocd_bytes)
        struct.pack_into("<I", eocd_for_hash, 16, cd_offset)
        top_digest = chunk_digests([before_cd, cd_bytes, bytes(eocd_for_hash)])

        with open(cert_der, "rb") as f:
            cert_der_bytes = f.read()

        spki_der = subprocess.check_output(
            ["openssl", "x509", "-in", cert_pem, "-pubkey", "-noout"],
            stderr=subprocess.DEVNULL,
        )
        spki_pem_path = os.path.join(tmpdir, "spki.pem")
        with open(spki_pem_path, "wb") as f:
            f.write(spki_der)
        spki_bytes = subprocess.check_output(
            ["openssl", "pkey", "-pubin", "-in", spki_pem_path, "-outform", "DER"],
            stderr=subprocess.DEVNULL,
        )

        def lp(b: bytes) -> bytes:
            return struct.pack("<I", len(b)) + b

        digest_entry = struct.pack("<I", 0x0103) + lp(top_digest)
        digests_seq = lp(digest_entry)
        certs_seq = lp(cert_der_bytes)
        attrs_seq = b""

        signed_data = lp(digests_seq) + lp(certs_seq) + lp(attrs_seq)
        signed_data_path = os.path.join(tmpdir, "signed_data.bin")
        sig_out_path = os.path.join(tmpdir, "sig.bin")
        with open(signed_data_path, "wb") as f:
            f.write(signed_data)

        subprocess.run(
            ["openssl", "dgst", "-sha256", "-sign", key_pem, "-out", sig_out_path, signed_data_path],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        with open(sig_out_path, "rb") as f:
            rsa_sig = f.read()

        sig_entry = struct.pack("<I", 0x0103) + lp(rsa_sig)
        sigs_seq = lp(sig_entry)

        signer = lp(signed_data) + lp(sigs_seq) + lp(spki_bytes)
        signers_seq = lp(signer)
        v2_block_value = lp(signers_seq)

        pair = struct.pack("<QI", 4 + len(v2_block_value), 0x7109871A) + v2_block_value
        block_size_excluding_first8 = len(pair) + 8 + 16
        apk_sig_block = (
            struct.pack("<Q", block_size_excluding_first8)
            + pair
            + struct.pack("<Q", block_size_excluding_first8)
            + b"APK Sig Block 42"
        )

        new_cd_offset = cd_offset + len(apk_sig_block)
        struct.pack_into("<I", eocd_bytes, 16, new_cd_offset)

        final_apk = before_cd + apk_sig_block + cd_bytes + bytes(eocd_bytes)
        with open(apk_out_path, "wb") as f:
            f.write(final_apk)


def main():
    write_svg_icon(os.path.join(PUBLIC_DIR, "icon.svg"))
    with open(os.path.join(PUBLIC_DIR, "pwa-192x192.png"), "wb") as f:
        f.write(create_png(192, 192, maskable=False))
    with open(os.path.join(PUBLIC_DIR, "pwa-512x512.png"), "wb") as f:
        f.write(create_png(512, 512, maskable=False))
    with open(os.path.join(PUBLIC_DIR, "pwa-maskable-512x512.png"), "wb") as f:
        f.write(create_png(512, 512, maskable=True))
    with open(os.path.join(PUBLIC_DIR, "apple-touch-icon.png"), "wb") as f:
        f.write(create_png(180, 180, maskable=False))

    apk_path = os.path.join(PUBLIC_DIR, "FDE-Sales-Copilot-v2.0.apk")
    sign_and_build_apk(apk_path)
    print(f"Generated icons and standalone signed APK ({os.path.getsize(apk_path)} bytes) at {apk_path}")


if __name__ == "__main__":
    main()
