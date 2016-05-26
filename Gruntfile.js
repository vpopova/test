module.exports = function (grunt) {

	// Initializing the configuration object
	grunt.initConfig({

		// Task configuration
		less: {
			development: {
				options: {
					compress: false //minifying the result
				},
				files: {
					// Compiling main.less into main.css
					'app/assets/css/main.css': [
						'app/assets/css/reset.less',
						'app/assets/css/mobile-s.less',
						'app/assets/css/mobile-l.less',
						'app/assets/css/tablet-s.less',
						'app/assets/css/tablet-l.less',
						'app/assets/css/desktop-s.less',
						'app/assets/css/desktop-l.less'
					]
				}
			}
		},

		// Concat js files
		concat: {
			options: {
				separator: ';'
			},
			js1: {
				src: [
					'app/assets/js/jquery-v1.8.2.js',
					'app/assets/js/jquery.parallax.js',
					'app/assets/js/index.js'

				],
				dest: 'app/assets/js/concat/index.js'
			}
		},
		jshint: {
			src: [
				'app/assets/js/index.js'
			],
			dest: 'app/assets/js/concat/index.js'
		},
		// Add vendor prefixed styles
		autoprefixer: {
			css: {
				files: {
					'app/assets/css/main.css': 'app/assets/css/main.css'
				}
			}
		},

		// Minify css and javascript
		cssmin: {
			combine: {
				files: {
					'dist/assets/css/main.css': ['app/assets/css/main.css']
				}
			}
		},

		// Minify JS files
		uglify: {
			options: {
				mangle: true, // Use if you want the names of your functions and variables unchanged
				compress: true
			},
			js: {
				files: {
					'dist/assets/js/concat/index.js': ['app/assets/js/concat/index.js']
				}
			}
		},

		// Watches files for changes and runs tasks based on the changed files
		watch: {
			//jshint: {
			//    options: {
			//        jshintrc: '.jshintrc',
			//        reporter: require('jshint-stylish')
			//    },
			//    files: ['app/js/conact-index.js'],
			//    tasks: ['jshint:all', 'concat']
			//},

			gruntfile: {
				files: ['Gruntfile.js']
			},
			less: {
				files: ['app/assets/css/{,*/}*.less'],
				tasks: ['less', 'autoprefixer']
			},
			scripts: {
				files: ['app/assets/{,*/}*.js'],
				tasks: ['concat']
			},
			livereload: {
				options: {
					livereload: '<%= connect.livereload %>'
				},
				files: [
					'app/{,*/}*.html',
					'app/assets/css/{,*/}*.less',
					'app/assets/js/{,*/}*.js',
					'app/assets/images/{,*/}*.{gif,jpeg,jpg,png}'
				]
			}
		},
		// The actual grunt server settings
		connect: {
			// Development server for testing
			livereload: {
				options: {
					port: 9000,
					/* If you want to use localhost as a server for manual testing(without autoreload),
					 * remove the comment on keepalive.
					 * Be aware of that other commands after 'connect' want be lunched.
					 */ //
					keepalive: true,
					livereload: 35729,
					// Change this to '0.0.0.0' to access the server from outside
					hostname: 'localhost',
					open: true,
					base: 'app'
				}
			},
			// Distribution server for testing
			distribute: {
				options: {
					port: 9001,
					//keepalive: true,
					livereload: 35729,
					// Change this to '0.0.0.0' to access the server from outside
					hostname: 'localhost',
					open: true,
					base: 'dist'
				}
			}
		},
		// Empties folders to start fresh
		clean: {
			dist: {
				files: [{
					dot: true,
					src: [
						'dist'
					]
				}]
			},
			server: '.tmp'
		},
		// Copies remaining files to dist folder
		copy: {
			dist: {
				files: [{
					expand: true,
					dot: true,
					cwd: 'app',
					dest: 'dist',
					src: [
						'assets/images/favicons/favicon.ico',
						'assets/fonts/{,*/}*.*',
					]
				}]
			}
		},
		// Minify images
		imagemin: {
			static: {
				options: {
					optimizationLevel: 3
				},
				files: [{
					expand: true,
					cwd: 'app/assets/images',
					src: ['{,*/}*.{png,jpg,gif}'],
					dest: 'dist/assets/images'
				}]
			}
		},
		// Minify HTML files
		htmlmin: {
			dist: {
				options: {
					collapseBooleanAttributes: true,
					collapseWhitespace: true,
					removeAttributeQuotes: true,
					removeCommentsFromCDATA: true,
					removeComments: true,
					removeEmptyAttributes: true,
					removeOptionalTags: true,
					removeRedundantAttributes: true,
					useShortDoctype: true
				},
				files: [{
					expand: true,
					cwd: 'app',
					src: '**/*.html',
					dest: 'dist'
				}]
			}
		},
		htmlcompressor: {
			compile: {
				files: {
					'dest/index.html': 'app/index.html'
				},
				options: {
					type: 'html',
					preserveServerScript: true
				}
			}
		},
		browserSync: {
			dev: {
				bsFiles: {
					src : [
						'app/assets/css/*.css',
						'app/*.html'
					]
				},
				options: {
					port: 9000,
					server: 'app'
				}
			}
		}
	});

	// Plugin loading
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-includes');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-browser-sync');


//	grunt.loadNpmTasks('grunt-htmlcompressor');
	// Task definition

	// Star a server with watch event for file changes
	grunt.registerTask('server', ['connect:livereload', 'watch']);

	// Run before distribution!!!!!!! Upload dist folder !!!!!!!!!!!!
	grunt.registerTask('build', ['clean', 'htmlmin', 'less', 'autoprefixer', 'cssmin', 'concat', 'imagemin', 'uglify', 'copy']);
};