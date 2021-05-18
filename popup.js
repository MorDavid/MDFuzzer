document.addEventListener('DOMContentLoaded', function() {
  document.getElementById("inputs").value="\",',<,>,`";
  document.getElementById("status").textContent = "Ready for action..."; 
  document.getElementById("btnCheck").addEventListener("click", function() {
    document.getElementById("status").innerHTML = "Execute..."; 
    chrome.storage.local.set({"inputs":document.getElementById("inputs").value});
    chrome.tabs.executeScript({file:"injection.js"},function(){
      chrome.storage.local.get("results", value => {
        document.getElementById("results").innerHTML = value.results;
      });
      chrome.storage.local.get("status", value => {
        document.getElementById("status").innerHTML = value.status;
      });
    });
  });
});

