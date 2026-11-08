#!/usr/bin/env python3
"""
Generates:
1. Compliant PWA PNG & SVG icons in public/:
   - public/icon.svg
   - public/pwa-192x192.png
   - public/pwa-512x512.png
   - public/pwa-maskable-512x512.png
   - public/apple-touch-icon.png (180x180)
2. A genuine, spec-compliant, signed Android WebView APK:
   - public/FDE-Sales-Copilot-v2.0.apk
   Featuring adaptive WebView (JavaScript, DOMStorage, WideViewPort, OverviewMode,
   orientation/screenSize adaptive configChanges), Binary AXML AndroidManifest.xml,
   Dalvik classes.dex, and RSA-2048 v1 (MANIFEST.MF/CERT.SF/CERT.RSA) + APK Signature Scheme v2.
"""

import os
import struct
import zlib
import hashlib
import base64
import subprocess
import tempfile
import zipfile

PUBLIC_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "public")
os.makedirs(PUBLIC_DIR, exist_ok=True)

APP_URL = "https://ais-pre-lfnhxod6gtdgymavhjdscm-102222692521.asia-northeast1.run.app"


# ==============================================================================
# PART 1: Generate Crisp PNG Icons & Brand SVG
# ==============================================================================
def write_svg_icon(path: str):
    svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#020617" />
      <stop offset="50%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#083344" />
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#22d3ee" />
      <stop offset="100%" stop-color="#10b981" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="112" fill="url(#bg)" />
  <rect x="28" y="28" width="456" height="456" rx="92" fill="none" stroke="#22d3ee" stroke-opacity="0.28" stroke-width="6" />
  <!-- Topology Network Nodes -->
  <line x1="256" y1="128" x2="156" y2="256" stroke="#22d3ee" stroke-width="10" stroke-linecap="round" opacity="0.85" />
  <line x1="256" y1="128" x2="356" y2="256" stroke="#22d3ee" stroke-width="10" stroke-linecap="round" opacity="0.85" />
  <line x1="156" y1="256" x2="256" y2="372" stroke="#10b981" stroke-width="10" stroke-linecap="round" opacity="0.9" />
  <line x1="356" y1="256" x2="256" y2="372" stroke="#22d3ee" stroke-width="8" stroke-dasharray="14 10" stroke-linecap="round" opacity="0.7" />
  <circle cx="256" cy="128" r="32" fill="#0f172a" stroke="#22d3ee" stroke-width="12" />
  <circle cx="156" cy="256" r="30" fill="#0f172a" stroke="#10b981" stroke-width="12" />
  <circle cx="356" cy="256" r="28" fill="#0f172a" stroke="#38bdf8" stroke-width="10" />
  <circle cx="256" cy="372" r="34" fill="url(#accent)" />
  <text x="256" y="456" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="44" fill="#f8fafc" letter-spacing="4">FDE 2B</text>
</svg>"""
    with open(path, "w", encoding="utf-8") as f:
        f.write(svg)


def create_png(width: int, height: int, maskable: bool = False) -> bytes:
    """Renders a sleek dark-slate + cyan/emerald network emblem PNG in pure Python."""
    raw_rows = bytearray()
    cx, cy = width / 2.0, height / 2.0
    scale = 0.78 if maskable else 0.92
    r_outer = (width * 0.36) * scale
    r_inner = (width * 0.14) * scale

    # Node centers relative to center
    nodes = [
        (cx, cy - r_outer * 0.65, width * 0.065 * scale, (34, 211, 238)),     # Top L1 node (Cyan)
        (cx - r_outer * 0.62, cy + r_outer * 0.05, width * 0.065 * scale, (16, 185, 129)),  # Left L2 node (Emerald)
        (cx + r_outer * 0.62, cy + r_outer * 0.05, width * 0.060 * scale, (56, 189, 248)),  # Right L3 node (Sky)
        (cx, cy + r_outer * 0.68, width * 0.072 * scale, (34, 211, 238)),     # Bottom L4 node (Cyan)
    ]

    edges = [
        (nodes[0][0], nodes[0][1], nodes[1][0], nodes[1][1]),
        (nodes[0][0], nodes[0][1], nodes[2][0], nodes[2][1]),
        (nodes[1][0], nodes[1][1], nodes[3][0], nodes[3][1]),
        (nodes[2][0], nodes[2][1], nodes[3][0], nodes[3][1]),
    ]

    line_thick = max(2.0, width * 0.018 * scale)
    ring_thick = max(2.0, width * 0.015 * scale)

    for y in range(height):
        raw_rows.append(0)  # PNG filter type 0 (None)
        ny = y / float(height)
        for x in range(width):
            nx = x / float(width)
            # Base dark gradient (#020617 -> #0f172a -> #083344)
            r = int(2 + 12 * nx + 6 * ny)
            g = int(6 + 24 * nx + 38 * ny)
            b = int(23 + 35 * nx + 45 * ny)

            # Subtle radar ring
            dist_center = ((x - cx) ** 2 + (y - cy) ** 2) ** 0.5
            if abs(dist_center - r_outer * 0.85) < ring_thick * 0.7:
                r, g, b = 14, 116, 144

            # Draw edges
            for x1, y1, x2, y2 in edges:
                dx, dy = x2 - x1, y2 - y1
                length_sq = dx * dx + dy * dy
                if length_sq > 0:
                    t = max(0.0, min(1.0, ((x - x1) * dx + (y - y1) * dy) / length_sq))
                    px, py = x1 + t * dx, y1 + t * dy
                    d = ((x - px) ** 2 + (y - py) ** 2) ** 0.5
                    if d <= line_thick:
                        r, g, b = 34, 211, 238

            # Draw nodes
            for ncx, ncy, nr, (cr, cg, cb) in nodes:
                nd = ((x - ncx) ** 2 + (y - ncy) ** 2) ** 0.5
                if nd <= nr:
                    if nd <= nr * 0.52:
                        r, g, b = 15, 23, 42
                    else:
                        r, g, b = cr, cg, cb

            raw_rows.extend((r, g, b, 255))

    def make_chunk(chunk_type: bytes, data: bytes) -> bytes:
        crc = zlib.crc32(chunk_type + data) & 0xFFFFFFFF
        return struct.pack(">I", len(data)) + chunk_type + data + struct.pack(">I", crc)

    ihdr = struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0)
    idat = zlib.compress(bytes(raw_rows), 9)
    return (
        b"\x89PNG\r\n\x1a\n"
        + make_chunk(b"IHDR", ihdr)
        + make_chunk(b"IDAT", idat)
        + make_chunk(b"IEND", b"")
    )


# ==============================================================================
# PART 2: Binary AndroidManifest.xml (AXML) Builder
# ==============================================================================
def build_binary_axml() -> bytes:
    """
    Constructs a valid binary AndroidManifest.xml (ResXMLTree) for package
    com.fde.salescopilot with MainActivity, INTERNET permission, hardwareAcceleration,
    and adaptive screen configChanges.
    """
    # Resource IDs in Android SDK must have their corresponding attribute names
    # at the exact beginning of the string pool in matching order.
    res_attr_strings = [
        "label",                # 0: 0x01010001
        "name",                 # 1: 0x01010003
        "exported",             # 2: 0x01010010
        "configChanges",        # 3: 0x0101001f
        "minSdkVersion",        # 4: 0x0101020c
        "versionCode",          # 5: 0x0101021b
        "versionName",          # 6: 0x0101021c
        "targetSdkVersion",     # 7: 0x01010270
        "hardwareAccelerated",  # 8: 0x010102d3
        "usesCleartextTraffic", # 9: 0x010104ec
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
        "android",                                    # 10
        "http://schemas.android.com/apk/res/android", # 11
        "",                                           # 12
        "manifest",                                   # 13
        "package",                                    # 14
        "com.fde.salescopilot",                       # 15
        "2.0.0",                                      # 16
        "uses-sdk",                                   # 17
        "uses-permission",                            # 18
        "android.permission.INTERNET",                # 19
        "application",                                # 20
        "FDE 随身销售参谋",                             # 21
        "activity",                                   # 22
        "com.fde.salescopilot.MainActivity",          # 23
        "intent-filter",                              # 24
        "action",                                     # 25
        "android.intent.action.MAIN",                 # 26
        "category",                                   # 27
        "android.intent.category.LAUNCHER",           # 28
    ]

    all_strings = res_attr_strings + other_strings
    idx = {s: i for i, s in enumerate(all_strings)}

    # Build UTF-16LE String Pool Chunk (RES_STRING_POOL_TYPE = 0x0001)
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
            0x0001,          # RES_STRING_POOL_TYPE
            header_size,     # headerSize = 28
            pool_chunk_size, # size
            string_count,    # stringCount
            0,               # styleCount
            0,               # flags (0 = UTF-16)
            strings_start,   # stringsStart
        )
        + struct.pack("<I", 0)  # stylesStart
        + b"".join(struct.pack("<I", o) for o in offsets)
        + strings_blob
    )

    # Resource Map Chunk (RES_XML_RESOURCE_MAP_TYPE = 0x0180)
    res_map_size = 8 + 4 * len(res_ids)
    res_map_chunk = struct.pack("<HHI", 0x0180, 8, res_map_size) + b"".join(
        struct.pack("<I", rid) for rid in res_ids
    )

    # Helper functions for XML nodes
    NS_ANDROID = idx["http://schemas.android.com/apk/res/android"]
    NS_NONE = 0xFFFFFFFF

    TYPE_STRING = 0x03
    TYPE_INT_DEC = 0x10
    TYPE_INT_HEX = 0x11
    TYPE_INT_BOOLEAN = 0x12

    def make_attr(ns: int, name_idx: int, raw_val: int, val_type: int, data: int) -> bytes:
        return struct.pack(
            "<IIIHBBI",
            ns,
            name_idx,
            raw_val,
            8,         # size of Res_value
            0,         # res0
            val_type,
            data,
        )

    def start_ns(prefix_idx: int, uri_idx: int, line: int = 2) -> bytes:
        return struct.pack("<HHIIII", 0x0100, 16, 24, line, 0xFFFFFFFF, prefix_idx) + struct.pack("<I", uri_idx)

    def end_ns(prefix_idx: int, uri_idx: int, line: int = 20) -> bytes:
        return struct.pack("<HHIIII", 0x0101, 16, 24, line, 0xFFFFFFFF, prefix_idx) + struct.pack("<I", uri_idx)

    def start_elem(name_idx: int, attrs: list, line: int = 2) -> bytes:
        attr_bytes = b"".join(attrs)
        chunk_size = 36 + len(attr_bytes)
        return (
            struct.pack(
                "<HHIIIIIHHHHHH",
                0x0102,        # RES_XML_START_ELEMENT_TYPE
                16,            # headerSize
                chunk_size,
                line,
                0xFFFFFFFF,    # comment
                NS_NONE,       # namespace
                name_idx,
                20,            # attributeStart
                20,            # attributeSize
                len(attrs),    # attributeCount
                0,             # idIndex
                0,             # classIndex
                0,             # styleIndex
            )
            + attr_bytes
        )

    def end_elem(name_idx: int, line: int = 20) -> bytes:
        return struct.pack("<HHIIIII", 0x0103, 16, 24, line, 0xFFFFFFFF, NS_NONE, name_idx)

    xml_chunks = []
    xml_chunks.append(start_ns(idx["android"], NS_ANDROID, 2))

    # <manifest package="com.fde.salescopilot" android:versionCode="20" android:versionName="2.0.0">
    xml_chunks.append(
        start_elem(
            idx["manifest"],
            [
                make_attr(NS_ANDROID, idx["versionCode"], 0xFFFFFFFF, TYPE_INT_DEC, 20),
                make_attr(NS_ANDROID, idx["versionName"], idx["2.0.0"], TYPE_STRING, idx["2.0.0"]),
                make_attr(NS_NONE, idx["package"], idx["com.fde.salescopilot"], TYPE_STRING, idx["com.fde.salescopilot"]),
            ],
            2,
        )
    )

    # <uses-sdk android:minSdkVersion="21" android:targetSdkVersion="28" />
    xml_chunks.append(
        start_elem(
            idx["uses-sdk"],
            [
                make_attr(NS_ANDROID, idx["minSdkVersion"], 0xFFFFFFFF, TYPE_INT_DEC, 21),
                make_attr(NS_ANDROID, idx["targetSdkVersion"], 0xFFFFFFFF, TYPE_INT_DEC, 28),
            ],
            4,
        )
    )
    xml_chunks.append(end_elem(idx["uses-sdk"], 4))

    # <uses-permission android:name="android.permission.INTERNET" />
    xml_chunks.append(
        start_elem(
            idx["uses-permission"],
            [
                make_attr(
                    NS_ANDROID,
                    idx["name"],
                    idx["android.permission.INTERNET"],
                    TYPE_STRING,
                    idx["android.permission.INTERNET"],
                )
            ],
            6,
        )
    )
    xml_chunks.append(end_elem(idx["uses-permission"], 6))

    # <application android:label="FDE 随身销售参谋" android:hardwareAccelerated="true" android:usesCleartextTraffic="true">
    xml_chunks.append(
        start_elem(
            idx["application"],
            [
                make_attr(NS_ANDROID, idx["label"], idx["FDE 随身销售参谋"], TYPE_STRING, idx["FDE 随身销售参谋"]),
                make_attr(NS_ANDROID, idx["hardwareAccelerated"], 0xFFFFFFFF, TYPE_INT_BOOLEAN, 0xFFFFFFFF),
                make_attr(NS_ANDROID, idx["usesCleartextTraffic"], 0xFFFFFFFF, TYPE_INT_BOOLEAN, 0xFFFFFFFF),
            ],
            8,
        )
    )

    # <activity android:name="com.fde.salescopilot.MainActivity" android:exported="true" android:configChanges="0x0db0">
    # 0x0db0 = orientation(0x0080) | screenSize(0x0400) | keyboardHidden(0x0020) | smallestScreenSize(0x0800) | screenLayout(0x0100)
    xml_chunks.append(
        start_elem(
            idx["activity"],
            [
                make_attr(
                    NS_ANDROID,
                    idx["name"],
                    idx["com.fde.salescopilot.MainActivity"],
                    TYPE_STRING,
                    idx["com.fde.salescopilot.MainActivity"],
                ),
                make_attr(NS_ANDROID, idx["exported"], 0xFFFFFFFF, TYPE_INT_BOOLEAN, 0xFFFFFFFF),
                make_attr(NS_ANDROID, idx["configChanges"], 0xFFFFFFFF, TYPE_INT_HEX, 0x0DB0),
            ],
            10,
        )
    )

    # <intent-filter>
    xml_chunks.append(start_elem(idx["intent-filter"], [], 12))
    xml_chunks.append(
        start_elem(
            idx["action"],
            [
                make_attr(
                    NS_ANDROID,
                    idx["name"],
                    idx["android.intent.action.MAIN"],
                    TYPE_STRING,
                    idx["android.intent.action.MAIN"],
                )
            ],
            13,
        )
    )
    xml_chunks.append(end_elem(idx["action"], 13))
    xml_chunks.append(
        start_elem(
            idx["category"],
            [
                make_attr(
                    NS_ANDROID,
                    idx["name"],
                    idx["android.intent.category.LAUNCHER"],
                    TYPE_STRING,
                    idx["android.intent.category.LAUNCHER"],
                )
            ],
            14,
        )
    )
    xml_chunks.append(end_elem(idx["category"], 14))
    xml_chunks.append(end_elem(idx["intent-filter"], 15))

    xml_chunks.append(end_elem(idx["activity"], 16))
    xml_chunks.append(end_elem(idx["application"], 18))
    xml_chunks.append(end_elem(idx["manifest"], 19))
    xml_chunks.append(end_ns(idx["android"], NS_ANDROID, 20))

    body = string_pool_chunk + res_map_chunk + b"".join(xml_chunks)
    total_size = 8 + len(body)
    return struct.pack("<HHI", 0x0003, 8, total_size) + body


# ==============================================================================
# PART 3: Valid Dalvik Executable (classes.dex) Builder
# ==============================================================================
def uleb128(value: int) -> bytes:
    out = bytearray()
    while True:
        byte = value & 0x7F
        value >>= 7
        if value != 0:
            byte |= 0x80
            out.append(byte)
        else:
            out.append(byte)
            break
    return bytes(out)


def build_classes_dex(app_url: str) -> bytes:
    """
    Constructs a valid Dalvik Executable (DEX 035) containing:
    package com.fde.salescopilot;
    public class MainActivity extends android.app.Activity {
        public MainActivity() { super(); }
        protected void onCreate(android.os.Bundle b) {
            super.onCreate(b);
            WebView wv = new WebView(this);
            WebSettings ws = wv.getSettings();
            ws.setJavaScriptEnabled(true);
            ws.setDomStorageEnabled(true);
            ws.setUseWideViewPort(true);
            ws.setLoadWithOverviewMode(true);
            wv.setWebViewClient(new WebViewClient());
            wv.loadUrl(app_url);
            this.setContentView(wv);
        }
    }
    """
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
        "setWebViewClient",
    ]
    strings = sorted(set(raw_strings))
    s_idx = {s: i for i, s in enumerate(strings)}

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
    # Ensure all type_names are in strings
    strings = sorted(set(raw_strings + type_names + ["Ljava/lang/String;"]))
    s_idx = {s: i for i, s in enumerate(strings)}

    types = sorted(type_names)
    t_idx = {t: i for i, t in enumerate(types)}

    # Protos: (shorty_str, return_type_str, [param_type_strs])
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

    # Methods: (class_type_str, name_str, return_type_str, (param_types...))
    method_defs = [
        ("Landroid/app/Activity;", "<init>", "V", ()),
        ("Landroid/app/Activity;", "onCreate", "V", ("Landroid/os/Bundle;",)),
        ("Landroid/app/Activity;", "setContentView", "V", ("Landroid/view/View;",)),
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

    # Dalvik bytecode for <init>()V:
    # invoke-direct {p0}, Landroid/app/Activity;-><init>()V  (7010 <method_idx> 0000)
    # return-void                                            (0e00)
    m_act_init = m_idx[("Landroid/app/Activity;", "<init>", "V", ())]
    insns_init = struct.pack("<HHH", 0x1070, m_act_init, 0x0000) + struct.pack("<H", 0x000E)
    code_init = struct.pack("<HHHHII", 1, 1, 1, 0, 0, len(insns_init) // 2) + insns_init

    # Dalvik bytecode for onCreate(Landroid/os/Bundle;)V
    # Registers: v0 (wv), v1 (ws/client/url), v2 (true), v3 (this/p0), v4 (bundle/p1)
    # registers_size = 5, ins_size = 2, outs_size = 2
    m_super_oncreate = m_idx[("Landroid/app/Activity;", "onCreate", "V", ("Landroid/os/Bundle;",))]
    m_wv_init = m_idx[("Landroid/webkit/WebView;", "<init>", "V", ("Landroid/content/Context;",))]
    m_wv_settings = m_idx[("Landroid/webkit/WebView;", "getSettings", "Landroid/webkit/WebSettings;", ())]
    m_ws_js = m_idx[("Landroid/webkit/WebSettings;", "setJavaScriptEnabled", "V", ("Z",))]
    m_ws_dom = m_idx[("Landroid/webkit/WebSettings;", "setDomStorageEnabled", "V", ("Z",))]
    m_ws_wide = m_idx[("Landroid/webkit/WebSettings;", "setUseWideViewPort", "V", ("Z",))]
    m_ws_overview = m_idx[("Landroid/webkit/WebSettings;", "setLoadWithOverviewMode", "V", ("Z",))]
    m_wvc_init = m_idx[("Landroid/webkit/WebViewClient;", "<init>", "V", ())]
    m_wv_client = m_idx[("Landroid/webkit/WebView;", "setWebViewClient", "V", ("Landroid/webkit/WebViewClient;",))]
    m_wv_load = m_idx[("Landroid/webkit/WebView;", "loadUrl", "V", ("Ljava/lang/String;",))]
    m_act_content = m_idx[("Landroid/app/Activity;", "setContentView", "V", ("Landroid/view/View;",))]

    t_wv = t_idx["Landroid/webkit/WebView;"]
    t_wvc = t_idx["Landroid/webkit/WebViewClient;"]
    s_url = s_idx[app_url]

    insns_oncreate = b"".join([
        # invoke-super {v3, v4}, Landroid/app/Activity;->onCreate(Landroid/os/Bundle;)V
        struct.pack("<HHH", 0x206F, m_super_oncreate, 0x0043),
        # new-instance v0, Landroid/webkit/WebView;
        struct.pack("<HH", 0x0022, t_wv),
        # invoke-direct {v0, v3}, Landroid/webkit/WebView;-><init>(Landroid/content/Context;)V
        struct.pack("<HHH", 0x2070, m_wv_init, 0x0030),
        # invoke-virtual {v0}, Landroid/webkit/WebView;->getSettings()Landroid/webkit/WebSettings;
        struct.pack("<HHH", 0x106E, m_wv_settings, 0x0000),
        # move-result-object v1
        struct.pack("<H", 0x010C),
        # const/4 v2, 0x1
        struct.pack("<H", 0x1212),
        # invoke-virtual {v1, v2}, WebSettings->setJavaScriptEnabled(Z)V
        struct.pack("<HHH", 0x206E, m_ws_js, 0x0021),
        # invoke-virtual {v1, v2}, WebSettings->setDomStorageEnabled(Z)V
        struct.pack("<HHH", 0x206E, m_ws_dom, 0x0021),
        # invoke-virtual {v1, v2}, WebSettings->setUseWideViewPort(Z)V
        struct.pack("<HHH", 0x206E, m_ws_wide, 0x0021),
        # invoke-virtual {v1, v2}, WebSettings->setLoadWithOverviewMode(Z)V
        struct.pack("<HHH", 0x206E, m_ws_overview, 0x0021),
        # new-instance v1, Landroid/webkit/WebViewClient;
        struct.pack("<HH", 0x0122, t_wvc),
        # invoke-direct {v1}, Landroid/webkit/WebViewClient;-><init>()V
        struct.pack("<HHH", 0x1070, m_wvc_init, 0x0001),
        # invoke-virtual {v0, v1}, WebView->setWebViewClient(WebViewClient)V
        struct.pack("<HHH", 0x206E, m_wv_client, 0x0010),
        # const-string v1, app_url
        struct.pack("<HH", 0x011A, s_url),
        # invoke-virtual {v0, v1}, WebView->loadUrl(String)V
        struct.pack("<HHH", 0x206E, m_wv_load, 0x0010),
        # invoke-virtual {v3, v0}, Activity->setContentView(View)V
        struct.pack("<HHH", 0x206E, m_act_content, 0x0003),
        # return-void
        struct.pack("<H", 0x000E),
    ])
    code_oncreate = struct.pack("<HHHHII", 5, 2, 2, 0, 0, len(insns_oncreate) // 2) + insns_oncreate

    # Layout fixed header & index tables:
    # Header: 0x70 (112 bytes)
    off_string_ids = 0x70
    off_type_ids = off_string_ids + 4 * len(strings)
    off_proto_ids = off_type_ids + 4 * len(types)
    off_method_ids = off_proto_ids + 12 * len(proto_defs)
    off_class_defs = off_method_ids + 8 * len(method_defs)
    off_data = off_class_defs + 32  # 1 class_def

    data_buf = bytearray()

    def align4():
        while (off_data + len(data_buf)) % 4 != 0:
            data_buf.append(0)

    # 1. type_lists for protos with parameters
    proto_param_offs = []
    for shorty, ret_t, params in proto_defs:
        if not params:
            proto_param_offs.append(0)
        else:
            align4()
            poff = off_data + len(data_buf)
            proto_param_offs.append(poff)
            data_buf.extend(struct.pack("<I", len(params)))
            for pt in params:
                data_buf.extend(struct.pack("<H", t_idx[pt]))

    # 2. code_items (4-byte aligned)
    align4()
    off_code_init = off_data + len(data_buf)
    data_buf.extend(code_init)

    align4()
    off_code_oncreate = off_data + len(data_buf)
    data_buf.extend(code_oncreate)

    # 3. string_data_items
    string_data_offs = []
    for s in strings:
        string_data_offs.append(off_data + len(data_buf))
        utf8_bytes = s.encode("utf-8")
        data_buf.extend(uleb128(len(s)))
        data_buf.extend(utf8_bytes)
        data_buf.append(0)

    # 4. class_data_item
    off_class_data = off_data + len(data_buf)
    m_main_init = m_idx[("Lcom/fde/salescopilot/MainActivity;", "<init>", "V", ())]
    m_main_oncreate = m_idx[("Lcom/fde/salescopilot/MainActivity;", "onCreate", "V", ("Landroid/os/Bundle;",))]
    class_data_item = (
        uleb128(0)  # static_fields_size
        + uleb128(0)  # instance_fields_size
        + uleb128(1)  # direct_methods_size (<init>)
        + uleb128(1)  # virtual_methods_size (onCreate)
        # direct_method[0]: <init>, access=PUBLIC|CONSTRUCTOR (0x10001)
        + uleb128(m_main_init)
        + uleb128(0x10001)
        + uleb128(off_code_init)
        # virtual_method[0]: onCreate, access=PROTECTED (0x0004)
        + uleb128(m_main_oncreate)
        + uleb128(0x0004)
        + uleb128(off_code_oncreate)
    )
    data_buf.extend(class_data_item)

    # 5. map_list (4-byte aligned at end of data section)
    align4()
    off_map_list = off_data + len(data_buf)
    map_items = [
        (0x0000, 1, 0x00000000),            # TYPE_HEADER_ITEM
        (0x0001, len(strings), off_string_ids),
        (0x0002, len(types), off_type_ids),
        (0x0003, len(proto_defs), off_proto_ids),
        (0x0005, len(method_defs), off_method_ids),
        (0x0006, 1, off_class_defs),
        (0x1001, sum(1 for x in proto_param_offs if x != 0), next(x for x in proto_param_offs if x != 0)),
        (0x2001, 2, off_code_init),
        (0x2002, len(strings), string_data_offs[0]),
        (0x2000, 1, off_class_data),
        (0x1000, 1, off_map_list),
    ]
    data_buf.extend(struct.pack("<I", len(map_items)))
    for m_type, m_size, m_off in map_items:
        data_buf.extend(struct.pack("<HHII", m_type, 0, m_size, m_off))

    file_size = off_data + len(data_buf)
    data_size = len(data_buf)

    # Assemble index tables
    string_ids_bin = b"".join(struct.pack("<I", o) for o in string_data_offs)
    type_ids_bin = b"".join(struct.pack("<I", s_idx[t]) for t in types)
    proto_ids_bin = b"".join(
        struct.pack("<III", s_idx[p[0]], t_idx[p[1]], proto_param_offs[i])
        for i, p in enumerate(proto_defs)
    )
    method_ids_bin = b"".join(
        struct.pack("<HHI", t_idx[m[0]], p_idx[(m[2], m[3])], s_idx[m[1]])
        for m in method_defs
    )
    class_defs_bin = struct.pack(
        "<IIIIIIII",
        t_idx["Lcom/fde/salescopilot/MainActivity;"],  # class_idx
        0x0001,                                        # PUBLIC
        t_idx["Landroid/app/Activity;"],               # superclass_idx
        0,                                             # interfaces_off
        0xFFFFFFFF,                                    # source_file_idx
        0,                                             # annotations_off
        off_class_data,                                # class_data_off
        0,                                             # static_values_off
    )

    header_prefix = b"dex\n035\x00"
    header_rest = struct.pack(
        "<20I",
        file_size,
        0x70,            # header_size
        0x12345678,      # endian_tag
        0,               # link_size
        0,               # link_off
        off_map_list,    # map_off
        len(strings), off_string_ids,
        len(types), off_type_ids,
        len(proto_defs), off_proto_ids,
        0, 0,            # field_ids
        len(method_defs), off_method_ids,
        1, off_class_defs,
        data_size, off_data,
    )

    body_after_sig = header_rest + string_ids_bin + type_ids_bin + proto_ids_bin + method_ids_bin + class_defs_bin + bytes(data_buf)
    sha1_digest = hashlib.sha1(body_after_sig).digest()
    adler = zlib.adler32(sha1_digest + body_after_sig) & 0xFFFFFFFF

    return header_prefix + struct.pack("<I", adler) + sha1_digest + body_after_sig


# ==============================================================================
# PART 4: Build & Sign APK (v1 JAR Signature + APK Signature Scheme v2)
# ==============================================================================
def sign_and_build_apk(apk_out_path: str):
    axml_bytes = build_binary_axml()
    dex_bytes = build_classes_dex(APP_URL)

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

        # Build v1 JAR Signature (META-INF/MANIFEST.MF, CERT.SF, CERT.RSA)
        axml_b64 = base64.b64encode(hashlib.sha256(axml_bytes).digest()).decode("ascii")
        dex_b64 = base64.b64encode(hashlib.sha256(dex_bytes).digest()).decode("ascii")

        manifest_Entry_1 = f"Name: AndroidManifest.xml\r\nSHA-256-Digest: {axml_b64}\r\n\r\n".encode("utf-8")
        manifest_Entry_2 = f"Name: classes.dex\r\nSHA-256-Digest: {dex_b64}\r\n\r\n".encode("utf-8")
        manifest_header = b"Manifest-Version: 1.0\r\nCreated-By: 1.0 (Android)\r\n\r\n"
        manifest_mf = manifest_header + manifest_Entry_1 + manifest_Entry_2

        main_digest = base64.b64encode(hashlib.sha256(manifest_mf).digest()).decode("ascii")
        e1_digest = base64.b64encode(hashlib.sha256(manifest_Entry_1).digest()).decode("ascii")
        e2_digest = base64.b64encode(hashlib.sha256(manifest_Entry_2).digest()).decode("ascii")

        cert_sf = (
            f"Signature-Version: 1.0\r\n"
            f"Created-By: 1.0 (Android)\r\n"
            f"SHA-256-Digest-Manifest: {main_digest}\r\n"
            f"X-Android-APK-Signed: 2\r\n\r\n"
            f"Name: AndroidManifest.xml\r\n"
            f"SHA-256-Digest: {e1_digest}\r\n\r\n"
            f"Name: classes.dex\r\n"
            f"SHA-256-Digest: {e2_digest}\r\n\r\n"
        ).encode("utf-8")

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

        # First create standard ZIP with AndroidManifest.xml, classes.dex, and META-INF/*
        unsigned_zip_path = os.path.join(tmpdir, "base.apk")
        with zipfile.ZipFile(unsigned_zip_path, "w", compression=zipfile.ZIP_DEFLATED) as zf:
            zf.writestr("AndroidManifest.xml", axml_bytes)
            zf.writestr("classes.dex", dex_bytes)
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

        # Compute APK Signature Scheme v2 digest (ID = 0x7109871a, Content Digest Algorithm = 0x0103 RSA_PKCS1_V1_5_WITH_SHA256)
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

        # In APK Signature Scheme v2, the EOCD section has its CD offset field set to the offset of the APK Signing Block (= cd_offset)
        eocd_for_hash = bytearray(eocd_bytes)
        struct.pack_into("<I", eocd_for_hash, 16, cd_offset)
        top_digest = chunk_digests([before_cd, cd_bytes, bytes(eocd_for_hash)])

        with open(cert_der, "rb") as f:
            cert_der_bytes = f.read()

        # Extract SubjectPublicKeyInfo (DER)
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

        # digest entry: uint32 algo_id (0x0103 = RSA_PKCS1_V1_5_WITH_SHA256), lp(digest)
        digest_entry = struct.pack("<I", 0x0103) + lp(top_digest)
        digests_seq = lp(digest_entry)
        certs_seq = lp(cert_der_bytes)
        attrs_seq = b""  # empty additional attributes

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

        # Pair: uint64 len(id + value), uint32 id (0x7109871a), value
        pair = struct.pack("<QI", 4 + len(v2_block_value), 0x7109871A) + v2_block_value
        # Pad APK Signing Block so total block size is a multiple of 4096 if desired, or 8-byte aligned
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
    print(f"Generated icons and signed APK ({os.path.getsize(apk_path)} bytes) at {apk_path}")


if __name__ == "__main__":
    main()
