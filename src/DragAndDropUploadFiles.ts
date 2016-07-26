class DragAndDropUploadFiles {
    fl: FileList;
    fr: FileReader;

    handleFile(event: DragEvent) : void {
        event.stopPropagation();
        event.preventDefault();

        this.fl = event.dataTransfer.files;
        this.fr = new FileReader();

        var output: Array<any> = [];
        for (var i = 0, f; f = this.fl[i]; i++) {
            output.push('<li><strong>', encodeURI(f.name), '</strong> (', f.type || 'n/a', ') - ', f.size, ' bytes, last modified: ',
                f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a', '</li>');
            if(!f.type.match("image.*"))
                continue;

            this.fr.onload = (function(file) {
                return function (e) {
                    var span = document.createElement('span');
                    span.innerHTML = ['<img class="thumb" src="', e.target.result, '", "target="', encodeURI(file.name),'"/>'].join('');
                    document.getElementById('list').insertBefore(span, null);
                }
            })(f);

            this.fr.readAsDataURL(f);
        }
        document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';

    }

    static DropFile(file) {
        file.stopPropagation();
        file.preventDefault();

        file.dataTransfer.dropEffect = 'copy';
    }

}

var dropZone = document.getElementById('drop_zone');

var dnd: DragAndDropUploadFiles = new DragAndDropUploadFiles();

dropZone.addEventListener('dragover', DragAndDropUploadFiles.DropFile, false);
dropZone.addEventListener('drop', dnd.handleFile, false);


