// Validation

var ref = document.referrer;
if(ref == "http://127.0.0.1:8080/register.html")
{
	var ele = document.createElement("p");
	ele.setAttribute("class", "HeadRef");
	ele.innerHTML = "Registered Successfully.";
	document.body.append(ele);
}

function ValidateEmail()
{
	var email = document.getElementsByName("email")[0].value;
	var mail_regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	if(mail_regex.test(String(email).toLowerCase()))
	{
		document.getElementsByClassName("alerts")[0].style.display = "none";
		// document.getElementsByClassName("ipbutton")[0].removeAttribute("disabled");
	}
	else
	{
		document.getElementsByClassName("alerts")[0].style.display = "block";
	}
}

function ValidatePass(){
	var pass = document.getElementsByName("password")[0].value;
	if(String(pass).length >= 3)
	{
		document.getElementsByClassName("alerts")[1].style.display = "none";
		// document.getElementsByClassName("ipbutton")[0].removeAttribute("disabled");
	}
	else
	{
		document.getElementsByClassName("alerts")[1].style.display = "block";
	}
}