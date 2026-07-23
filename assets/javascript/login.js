// JavaScript Document
function validate(){
	var username = document.getElementById("username").value;
	var password = document.getElementById("password").value;
	
	if ( username == "email" && password == "email")
		{
			/*alert ("Login successfully");*/
			window.location = "https://dabblecraft.com/Forums/secret/"; // Redirecting to other page.

			return false;
		}
	else
		{
			alert("Please try again")
		}
/*displays error message*/
}
