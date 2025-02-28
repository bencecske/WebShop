document.getElementById('Upload').classList.add('.show');

function UploadClick() {
document.getElementById('Upload').classList.add('.show');
document.getElementById('Edit').classList.add('.hide');
document.getElementById('Delete').classList.add('.hide');
}

function EditClick() {
document.getElementById('Edit').classList.add('.show');
document.getElementById('Upload').classList.add('.hide');
document.getElementById('Delete').classList.add('.hide');
}

function DeleteClick() {
document.getElementById('Delete').classList.add('.show');
document.getElementById('Edit').classList.add('.hide');
document.getElementById('Upload').classList.add('.hide');
}