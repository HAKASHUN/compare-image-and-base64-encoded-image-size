var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function(grunt) {
  /* package.jsonの内容を読み込む */
  var pkg = grunt.file.readJSON('package.json');

  // mockファイルのパス設定
  var mockConfig = {
    app: './',    //アプリが入っているディレクトリ名
    dist: 'build' //ビルドするディレクトリ名
  };

  grunt.initConfig({
    mock: mockConfig,
    //監視設定
    watch: {
      options: {
        nospawn: true
      },
      //ライブリロード設定
      livereload: {
        options: {
          livereload: LIVERELOAD_PORT
        },
        files: [
          '<%= mock.app %>/*.html',
          '<%= mock.app %>/css/*.css'
        ]
      }
    },
    //ローカルサーバー設定
    connect: {
      options: {
        port: 9000,
        hostname: 'localhost'
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, mockConfig.app)
            ];
          }
        }
      }
    },
    //自動でブラウザ起動 -> ファイル表示
    open: {
      server: {
        path: 'http://localhost:<%= connect.options.port %>/index.html'
      }
    },
    clean: {
      server: '.tmp'
    }
  });

  // loadNpmTasksを変更
  var taskName;
  for(taskName in pkg.devDependencies) {
    if(taskName.substring(0, 6) == 'grunt-') {
      grunt.loadNpmTasks(taskName);
    }
  }

  // defaultタスク
  grunt.registerTask('server', function(target) {
    grunt.task.run([
      'clean:server',
      'connect:livereload',
      'open',
      'watch'
    ])
  });
  grunt.registerTask('default', function(target) {
    grunt.task.run([
      'clean:server',
      'open'
    ])
  });
};