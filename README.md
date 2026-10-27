# FileAttributes RPC reproducer

Reproduces `Integer cannot be cast to Long` in
`org.openrewrite.FileAttributes.rpcReceive`.

The JavaScript recipe sets `rpc-size-repro.txt`'s size metadata to `42`,
without changing its contents. Java receives the JSON number as `Integer`
where the codec expects `Long`. The recipe does not throw the exception itself.
Use only the disposable sample project.

## Structure

- `src/index.js`: marketplace registration.
- `src/recipes/ReproduceFileSizeRpc.js`: recipe implementation.
- `sample-project/rpc-size-repro.txt`: input for the CLI run.

## Reproduce (PowerShell)

Requires Node.js 22+, Git, and an authenticated/licensed Moderne CLI.
Verified with CLI **4.11.1**, Java Rewrite **8.93.11**, and npm SDK **8.93.11**.
A runtime containing a fix may no longer fail.

From the repository root:

```powershell
npm ci --registry=https://registry.npmjs.org
mod config recipes npm install "$PWD\src\index.js"
```

Initialize the sample as a separate Git repository once:

```powershell
git -C .\sample-project init
git -C .\sample-project add rpc-size-repro.txt
git -C .\sample-project -c user.name="Reproducer" -c user.email="reproducer@example.org" commit -m "Add sample"
git -C .\sample-project remote add origin https://example.org/rpc-size-repro.git
```

The placeholder origin is required for CLI discovery; do not fetch or push it.
If the sample is already initialized with an origin, skip that setup.

```powershell
mod build "$PWD\sample-project"
mod run "$PWD\sample-project" --recipe=org.example.ReproduceFileSizeRpc --no-patch
mod study "$PWD\sample-project" --last-recipe-run --data-table SourcesFileErrors --csv
```

Expect one repository built and one source-file error. Open the CSV printed by
`mod study`:

```text
java.lang.ClassCastException: class java.lang.Integer cannot be cast to class java.lang.Long
  org.openrewrite.FileAttributes.rpcReceive(FileAttributes.java:96)
```

The CLI can report `MOD SUCCEEDED` despite this error; inspect the CSV,
not just the process exit code.
