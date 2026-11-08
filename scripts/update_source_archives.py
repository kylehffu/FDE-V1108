#!/usr/bin/env python3
"""
Packages the complete, up-to-date FDE Consultative Sales Copilot v2.0 source code
into both:
- /fde-consultative-copilot-v2-source.zip
- /fde-consultative-copilot-v2-source.tar.gz
and copies them into /public/ as well so both static and Express API routes serve
the latest codebase.
"""

import os
import shutil
import tarfile
import zipfile

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC_DIR = os.path.join(ROOT_DIR, "public")

EXCLUDE_DIRS = {
    "node_modules",
    "dist",
    ".git",
    ".aistudio",
    "__pycache__",
}

EXCLUDE_FILES = {
    "fde-consultative-copilot-v2-source.zip",
    "fde-consultative-copilot-v2-source.tar.gz",
    "fde-consultative-copilot-source.zip",
    "fde-consultative-copilot-source.tar.gz",
    ".DS_Store",
}


def iter_project_files(root_dir: str):
    for dirpath, dirnames, filenames in os.walk(root_dir):
        dirnames[:] = sorted(d for d in dirnames if d not in EXCLUDE_DIRS and not d.startswith(".git"))
        for fname in sorted(filenames):
            if fname in EXCLUDE_FILES:
                continue
            full_path = os.path.join(dirpath, fname)
            rel_path = os.path.relpath(full_path, root_dir)
            # Avoid packaging duplicate archives inside public/
            if rel_path.startswith("public/") and fname.endswith((".zip", ".tar.gz")):
                continue
            yield full_path, rel_path


def build_archives():
    zip_root_path = os.path.join(ROOT_DIR, "fde-consultative-copilot-v2-source.zip")
    tar_root_path = os.path.join(ROOT_DIR, "fde-consultative-copilot-v2-source.tar.gz")

    files = list(iter_project_files(ROOT_DIR))

    # Build .zip archive
    with zipfile.ZipFile(zip_root_path, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as zf:
        for full_path, rel_path in files:
            zf.write(full_path, arcname=rel_path)

    # Build .tar.gz archive
    with tarfile.open(tar_root_path, "w:gz") as tf:
        for full_path, rel_path in files:
            tf.add(full_path, arcname=rel_path)

    # Sync to public/ directory as well
    os.makedirs(PUBLIC_DIR, exist_ok=True)
    shutil.copy2(zip_root_path, os.path.join(PUBLIC_DIR, "fde-consultative-copilot-v2-source.zip"))
    shutil.copy2(tar_root_path, os.path.join(PUBLIC_DIR, "fde-consultative-copilot-v2-source.tar.gz"))

    print(
        f"Updated source archives with {len(files)} files:\n"
        f"  ZIP: {zip_root_path} ({os.path.getsize(zip_root_path)} bytes)\n"
        f"  TAR.GZ: {tar_root_path} ({os.path.getsize(tar_root_path)} bytes)"
    )


if __name__ == "__main__":
    build_archives()
