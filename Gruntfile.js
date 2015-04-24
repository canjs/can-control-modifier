module.exports = function(grunt) {

    grunt.initConfig({
        "steal-export": {
            transpile: {
                system: {
                    main: "src/modifier",
                    config: "package.json!npm"
                },
                options: {
                    debug: true
                },
                outputs: {
                    amd: {
                        graphs: ["src/modifier"],
                        format: "amd",
                        ignore: ['can/util', 'can/control', 'can/util/function']
                    },
                    cjs: {
                        graphs: ["src/modifier"],
                        format: "cjs",
                        ignore: ['can/util', 'can/control', 'can/util/function']
                    },
                    global: {
                        graphs: ["src/modifier"],
                        format: "global",
                        ignore: ['can/util', 'can/control', 'can/util/function']
                    }
                }
            }
        }
    });
    grunt.loadNpmTasks('steal-tools');

    // Default task(s).
    grunt.registerTask('default', ['steal-export']);

};
