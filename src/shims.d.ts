// Minimal type shims so the project typechecks in environments
// where dependencies are not installed yet.

declare module 'node:crypto' {
  const crypto: any;
  export = crypto;
}
declare module 'node:fs' {
  const fs: any;
  export = fs;
}
declare module 'node:path' {
  const path: any;
  export = path;
}

declare module 'better-sqlite3' {
  const Database: any;
  export default Database;
}

declare module 'bcryptjs' {
  const bcrypt: any;
  export default bcrypt;
}

declare const process: any;
declare const Buffer: any;
