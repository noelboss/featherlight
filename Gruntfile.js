module.exports = function(grunt) {
	// Project configuration
	var banner = '/**\n * Featherlight - ultra slim jQuery lightbox\n * Version <%= pkg.version %> - <%= pkg.homepage %>\n *\n * Copyright <%= grunt.template.today("yyyy") %>, <%= pkg.author.name %> (<%= pkg.author.url %>)\n * MIT Licensed.\n**/';
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			options: {
				banner: banner+'\n'
			},
			build: {
				src: 'src/<%= pkg.name %>.js',
				dest: 'release/<%= pkg.name %>.min.js'
			}
		},
		jshint: {
			options: {
				curly: true,
				eqeqeq: true,
				eqnull: true,
				browser: true,
				globals: {
					jQuery: true
				},
			},
			uses_defaults: ['src/**/*.js'],
		},
		cssmin: {
			options: {
				banner: banner
			},
			minify: {
				src: 'src/<%= pkg.name %>.css',
				dest: 'release/<%= pkg.name %>.min.css'
			}
		},
		jquerymanifest: {
			options: {
				source: grunt.file.readJSON('package.json'),
				overrides: {
					"name": "<%= pkg.name %>",
					"title": "<%= pkg.title %>",
					"dependencies": {
						"jquery": ">=1.7"
					}
				}
			}
		},
		prebump: {
			options: {
				patterns: [
					{
						match: '/<%= pkg.version %>/g',
						replacement: '@@version', // replaces "2013" to "2014"
						expression: true     // must be forced for templated regexp
					}
				],
				files: [
					{ src: ['index.html'], dest: 'release/index.html' },
					{ src: ['README.md'], dest: 'README.md'
				]
			}
		},
		bump: {
			options: {
				files: ['package.json', 'featherlight.jquery.json'],
				updateConfigs: ['pkg'],
				commit: true,
				commitMessage: 'Release v%VERSION%',
				commitFiles: ['-a'], // '-a' for all files
				createTag: true,
				tagName: '%VERSION%',
				tagMessage: 'Version %VERSION%',
				push: false,
				pushTo: 'upstream',
				gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d' // options to use with '$ git describe'
			}
		},
		postbump: {
			options: {
				patterns: [
					{
						match: 'version',
						replacement: '<%= pkg.version %>', // replaces "2013" to "2014"
						expression: false     // must be forced for templated regexp
					}
				]
			}
		}
	});

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-jquerymanifest');
	grunt.loadNpmTasks('grunt-bump');
	grunt.loadNpmTasks('grunt-replace');

	// Default task(s).
	grunt.registerTask('default', ['uglify','cssmin','jquerymanifest']);
	grunt.registerTask('release', ['prebump', 'bump-only', 'postbump', 'uglify','cssmin','jquerymanifest']);
};