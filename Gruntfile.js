module.exports = function(grunt) {

    grunt.loadNpmTasks('steal-tools');
    grunt.loadNpmTasks('grunt-bump');

    grunt.initConfig({
        "steal-export": {
            modifier: {
                system: {
                    config: "package.json!npm"
                },
                outputs: {
                    "+cjs": {},
                    "+amd": {},
                    "+global-js": {}
                }
            }
        },
        bump: {
            options: {
                files: ['package.json', 'bower.json'],
                commitFiles: ['package.json', 'bower.json'],
                prereleaseName: 'rc',
                push: false
            }
        },
    });

    grunt.registerTask('build', ['steal-export']);
};
