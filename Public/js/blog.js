// Post Edit
function postEdit(elem){
	// elem -> document.getElementById("Delete")
	// elem.children -> HTMLCollection(5) [h1.content-title, h6.content-author, hr, p.content-content, div.content-edit]
	// Gets the content-main 
	elem = elem.parentElement.parentElement
	
	// Creating the form
	var Edit_Form = document.createElement("form");
	// EditForm.setAttribute("method", "POST");
	// EditForm.setAttribute("action", "/post");
	Edit_Form.method = "POST";
	Edit_Form.action = "/editPost";	//TODO: use /edit

	//Title
	var Edit_Title = document.createElement("input");
	Edit_Title.type = "text";
	Edit_Title.name = "title";
	Edit_Title.value = elem.children[0].textContent;
	Edit_Title.setAttribute("class", "form-control");

	//Content
	var Edit_Content = document.createElement("textarea");
	Edit_Content.rows = "3";
	Edit_Content.name = "content";
	Edit_Content.value = elem.children[3].textContent;
	Edit_Content.setAttribute("class", "form-control");

	//Submit-Cancel div
	var Submit_Div = document.createElement("div");
	Submit_Div.setAttribute("class", "content-edit");

	//Submit
	var Edit_Submit = document.createElement("input");
	Edit_Submit.type = "submit";
	Edit_Submit.value = "Submit";
	Edit_Submit.style = "float: right; margin: 10px";
	Edit_Submit.setAttribute("class", "btn btn-info");

	//Cancel
	var Edit_Cancel = document.createElement("input");
	Edit_Cancel.type = "submit";
	Edit_Cancel.value = "cancel";
	Edit_Cancel.style = "float: right; margin: 10px";
	Edit_Cancel.setAttribute("class", "btn btn-info");

	//Hidden Post ID
	var Edit_postId = document.createElement("input");
	Edit_postId.type = "hidden";
	Edit_postId.name = "postId";
	Edit_postId.value = elem.children[4].children[0].children[0].value; //There is probably a better to do this but no. 

	Edit_Form.appendChild(Edit_postId);
	Submit_Div.appendChild(Edit_Submit);
	Submit_Div.appendChild(Edit_Cancel);

	//Appending stuff to main form
	Edit_Form.appendChild(Edit_Title);
	Edit_Form.appendChild(Edit_Content);
	Edit_Form.appendChild(Submit_Div);

	//Deleting all the elements
	while(elem.firstChild){
		elem.removeChild(elem.firstChild);
	}
	
	//Adding stuff to main div
	elem.style = "background: rgb(233, 225, 255)";
	elem.appendChild(Edit_Form);
}