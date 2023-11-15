function encode64(str: string): string {
  try {
    return btoa(
      encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_match, p1) =>
        String.fromCharCode(parseInt(p1, 16)),
      ),
    );
  } catch {
    return str;
  }
}

// Decoding base64 ⇢ UTF-8

function decode64(str: string): string {
  try {
    return decodeURIComponent(
      Array.prototype.map
        .call(
          atob(str),
          (c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`,
        )
        .join(""),
    );
  } catch {
    return str;
  }
}

export { decode64, encode64 };
