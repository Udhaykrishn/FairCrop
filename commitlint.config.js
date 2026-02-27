module.exports = {
    extends: ["@commitlint/config-conventional"],
    rules: {
        "type-enum": [
            2,
            "always",
            [
                "build",
                "ci",
                "docs",
                "feat",
                "fix",
                "perf",
                "refactor",
                "revert",
                "style",
                "test",
                "chore",
                "setup"
            ]
        ],
        "subject-case": [0, "never"], // Allows flexibility in commit subject case
        "subject-empty": [2, "never"],
        "type-empty": [2, "never"]
    }
};
