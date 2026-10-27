const { Recipe, TreeKind } = require("@openrewrite/rewrite");
const { PlainTextVisitor } = require("@openrewrite/rewrite/text");

class ReproduceFileSizeRpc extends Recipe {
    name = "org.example.ReproduceFileSizeRpc";
    displayName = "Reproduce file-size RPC decoding";
    description = "Sets a sample text file's size metadata to 42 to exercise Java RPC numeric decoding.";

    async editor() {
        return new class extends PlainTextVisitor {
            async visitText(text) {
                if (text.sourcePath !== "rpc-size-repro.txt" || text.fileAttributes?.size === 42) {
                    return text;
                }
                return {
                    ...text,
                    fileAttributes: {
                        kind: TreeKind.FileAttributes,
                        isReadable: true,
                        isWritable: true,
                        isExecutable: false,
                        ...text.fileAttributes,
                        size: 42
                    }
                };
            }
        };
    }
}

module.exports = { ReproduceFileSizeRpc };
