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
				uses_defaults: ['src/**/*.js']
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
					"version": "<%= pkg.version %>",
					"title": "<%= pkg.title %>",
					"description": "<%= pkg.description %>",
					"dependencies": {
						"jquery": ">=1.7"
					},
					"devDependencies": null,
					"main": null
				}
			}
		},
		replace: {
			src: {
				src: ['./README.md','./src/*.*'],
				overwrite: true,
				replacements: [
					{
						from: /Copyright\s[0-9]{4}/g,
						to: 'Copyright <%= grunt.template.today("yyyy") %>'
					},
					{
						from: /Current\sRelease\s[0-9]+[.]{1}[0-9]+[.]{1}[0-9]+/g,
						to: 'Current Release <%= pkg.version %>'
					},
					{
						from: /\([0-9]+[.]{1}[0-9]+[.]{1}[0-9]+\)/g,
						to: '(<%= pkg.version %>)'
					}
				]
			},
			min: {
				src: ['src/index.html'],
				dest: './',
				replacements: [
					{
						from: '="featherlight.',
						to: '="release/featherlight.min.'
					}
				]
			}
		},
		bump: {
			options: {
				files: [
					'package.json'
				],
				updateConfigs: ['pkg'],
				commit: true,
				commitMessage: 'Release Version %VERSION%',
				commitFiles: ['-a'], // '-a' for all files
				createTag: true,
				tagName: '%VERSION%',
				tagMessage: 'Released Version %VERSION%',
				push: false
				/*pushTo: 'upstream',*/
				/*gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d' // options to use with '$ git describe'*/
			}
		}
	});

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-text-replace');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-jquerymanifest');
	grunt.loadNpmTasks('grunt-bump');

	// Default task(s).
	grunt.registerTask('default', ['jshint',  'replace:src', 'replace', 'uglify', 'cssmin', 'jquerymanifest']);
	grunt.registerTask('test',    ['jshint']);
	grunt.registerTask('patch',   ['bump-only:patch', 'jshint', 'replace:src', 'replace:min', 'uglify', 'cssmin', 'jquerymanifest', 'bump-commit']);
	grunt.registerTask('minor',   ['bump-only:minor', 'jshint', 'replace:src', 'replace:min', 'uglify', 'cssmin', 'jquerymanifest', 'bump-commit']);
	grunt.registerTask('major',   ['bump-only:major', 'jshint', 'replace:src', 'replace:min', 'uglify', 'cssmin', 'jquerymanifest', 'bump-commit']);
};