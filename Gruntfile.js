const { config } = require("grunt");

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      concat: config('concat'),
      uglify: config('uglify'),
      cssmin: config('cssmin'),
      cssmin: {
        target: {
          files: {
            'core.bundle.css': ['css/*.css']
          }
        }
      },
      uglify: {
        my_target: {
          files: {
            'dist/core.bundle.js': ['js/slick.min.js', 'js/custom-slick.js', 'js/jquery.selectBox.js', 'js/custom-selectBox.js', 'js/script.js', 'js/magnific-popup.min.js', 'js/custom-magnific-popup.js', 'js/animation-script.js', 'js/journey-module-slider.js', 'js/vertical-slider.js']
          }
        }
      },
      concat: {
        dist: {
          src: ['js/slick.min.js', 'js/custom-slick.js', 'js/jquery.selectBox.js', 'js/custom-selectBox.js', 'js/script.js', 'js/magnific-popup.min.js', 'js/custom-magnific-popup.js', 'js/animation-script.js', 'js/journey-module-slider.js', 'js/vertical-slider.js'],
          dest: 'dist/core.bundle.js'
        }
      },
      watch: {
        stylesheets: { 
          files: ['css/*.css'],
          tasks: ['cssmin'],
          livereload: true
        },
        scripts: {
          files: ['js/**/*.js'],
           tasks: ['uglify']
        },
      },
    });
  
    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
 
    // Default task(s).
    grunt.registerTask('default', ['concat', 'uglify', 'cssmin', 'watch']);


  };