"""Losslessly compress raw PDF streams without rasterizing text or changing pages."""
from pypdf.generic import StreamObject


def compress_for_browser(writer):
    # Some classroom PDFs contain repeated, completely uncompressed page images.
    # Preserve every pixel, vector, annotation, and existing compression filter.
    for index, obj in enumerate(writer._objects):
        if isinstance(obj, StreamObject) and not obj.get('/Filter'):
            encoded = obj.flate_encode(level=9)
            encoded.indirect_reference = obj.indirect_reference
            writer._objects[index] = encoded
