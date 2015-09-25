module.exports = function (grunt) {
    'use strict';

    require('time-grunt')(grunt);
    require('jit-grunt')(grunt);

    var config = {
        app: 'app',
        dist: 'dist',
        tmp: '.tmp',
        test: 'test'
    };

    grunt.initConfig({
        config: config,

        watch: {
            options: {
                spawn: false
            },
            css: {
                files: ['<%= config.app %>/styles/{,*/}*.{scss,sass}'],
                tasks: ['css']
            },
            js: {
                files: ['<%= config.app %>/scripts/**/*.js'],
                tasks: ['js']
            },
            img: {
                files: ['<%= config.app %>/images/**/*'],
                tasks: ['images']
            }
        },

        clean: {
            dist: ['<%= config.tmp %>', '<%= config.dist %>'],
            tmp: ['<%= config.tmp %>'],
            styles: ['<%= config.tmp %>/styles'],
            scripts: ['<%= config.tmp %>/scripts'],
            images: ['<%= config.dist %>/images']
        },

        sass: {
            options: {
                imagePath: '<%= config.app %>/images'
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= config.app %>/styles/',
                    src: ['*.scss'],
                    dest: '<%= config.tmp %>/styles/',
                    ext: '.css'
                }]
            }
        },

        autoprefixer: {
            dist: {
                src: '<%= config.tmp %>/styles/*.css'
            }
        },

        cssmin: {
            dist: {
                files: {
                    '<%= config.dist %>/styles/main.css': [
                        '<%= config.tmp %>/styles/main.css'
                    ],
                    '<%= config.dist %>/styles/admin.css': [
                        '<%= config.tmp %>/styles/admin.css'
                    ]
                }
            }
        },

        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= config.app %>/images',
                    src: '{,*/}*.{png,jpg,jpeg}',
                    dest: '<%= config.dist %>/images'
                }]
            }
        },

        babel: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= config.app %>/scripts',
                    src: ['**/*.js'],
                    dest: '<%= config.tmp %>/scripts'
                }]
            }
        },

        webpack: {
            frontend: {
                entry: './<%= config.tmp %>/scripts/app.js',
                output: {
                    path: '<%= config.dist %>/scripts',
                    filename: 'bundle.min.js'
                }
            }
        },

        /*
        uglify: {
            frontend: {
                files: {
                  '<%= config.dist %>/scripts/bundle.min.js': ['<%= config.tmp %>/scripts/bundle.js']
                }
            }
        },
        */

        jshint: {
            options: {
                jshintrc: true
            },
            all: {
                src: [
                    'Gruntfile.js',
                    '<%= config.app %>/scripts/**/*.js',
                    '<%= config.test %>/**/*.js'
                ]
            }
        },

        jest: {
            all: {
                config: 'package.json',
                coverage: true,
                testPathPattern: /.*-test.js/
            }
        },

        jscs: {
            src: [
                '<%= config.app %>/scripts/**/*.js'
            ],
            options: {
                config: '.jscsrc'
            }
        },

        sprite: {
            all: {
                src: '<%= config.dist %>/images/sprites/*.png',
                dest: '<%= config.dist %>/images/sprites.png',
                destCss: '<%= config.app %>/styles/_sprites.scss'
            }
        },

        browserSync: {
            dev: {
                bsFiles: {
                    src : [
                        '<%= config.dist %>/styles/**/*.css',
                        '<%= config.dist %>/scripts/**/*.js',
                        './index.html'
                    ]
                },
                options: {
                    watchTask: true,
                    server: './'
                }
            }
        }

    });

    grunt.loadNpmTasks('grunt-spritesmith');

    grunt.registerTask('dev', ['build', 'browserSync', 'watch']);
    grunt.registerTask('js', ['clean:scripts', 'babel', 'webpack'/*, 'uglify'*/]);
    grunt.registerTask('images', ['clean:images', 'imagemin', 'sprite', 'css']);
    grunt.registerTask('css', ['clean:styles', 'sass', 'autoprefixer', 'cssmin']);
    grunt.registerTask('test', ['jscs', 'jshint', 'jest']);
    grunt.registerTask('build', ['default']);
    grunt.registerTask('default', ['test', 'clean:dist', 'js', 'css', 'images']);
};
