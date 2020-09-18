function init()
{
  for ( var i = 0, len = localStorage.length; i < len; ++i )
  {
    console.log( localStorage.getItem( localStorage.key( i ) ) );
  }

  if(localStorage["word"]!=undefined)
  {
    var urlParameter = getUrlParameter();
    var nowPageNumber = urlParameter.p;
    var totalWordCount = localStorage["id"]-1;
    var totalPageCount = parseInt(totalWordCount/5);

    if( nowPageNumber === undefined ) nowPageNumber = 1;


    if( totalWordCount%5 != 0 ) totalPageCount++;


    var word_arr = JSON.parse(localStorage["word"]);
    for(var i = 5 * nowPageNumber - 5; i < 5*nowPageNumber; i++ )
    {

      if(word_arr[i]!=undefined)
      {
        $(".word_area .list").append("<li>"+ word_arr[i].id +"  - "+word_arr[i].name+"  : "+word_arr[i].sup+
        "<input id='thisId' name='thisName' type='button' value='제거' onclick='set_word(this)'>"+
        "<input id='thisUpdate' type='button' value='수정' onclick='set_word(this)'>"+
        "</li>");

        $("#thisId").attr("name",word_arr[i].name);
        $("#thisId").attr("id",word_arr[i].id);
        $("#thisUpdate").attr("id",word_arr[i].id);
      }
    }

    var i = 0;
    var j = totalPageCount;
    if( totalPageCount > 10 )
    {
      j = 10;
      if( location.href.split("?p=")[1] >= 5 )
      {
        i = location.href.split("?p=")[1]-5;
        j = Number(location.href.split("?p=")[1])+Number(5);
        if( j > totalPageCount )
        {
          i = totalPageCount-10;
          j = totalPageCount;
        }
      }
    }

    for(i; i < j; i++ )
    {

      var page_number = location.href.split("?")[0]+"?p="+(i+1);
      var tag1 = $("<li><a href='"+page_number+"'>"+(i+1)+"</a></li>");
      if( page_number == location.href )
      {
        tag1 = $("<li><a class='nowPage' href='"+page_number+"'>"+(i+1)+"</a></li>");
      }
      $(".next_page_button_li").before(tag1);

    }
  }
}



function getUrlParameter()
{
  var url = document.location.href;
  var qs = url.substring(url.indexOf('?') + 1).split('&');
  for(var i = 0, result = {}; i < qs.length; i++){
      qs[i] = qs[i].split('=');
      result[qs[i][0]] = decodeURIComponent(qs[i][1]);
  }
  return result;
}

$(".prev_page_button").click(function()
{
  var urlParameter = getUrlParameter();
  var nowPageNumber = urlParameter.p;
  if( nowPageNumber === undefined ) nowPageNumber = 1;
  if( nowPageNumber == 1 ) return;
  document.location.href = location.href.split("?")[0]+"?p="+(--nowPageNumber);
});
$(".next_page_button").click(function()
{
  var urlParameter = getUrlParameter();
  var nowPageNumber = urlParameter.p;
  var totalWordCount = localStorage["id"]-1;
  var totalPageCount = parseInt(totalWordCount/5);
  if( totalWordCount%5 != 0 ) totalPageCount++;

  if( nowPageNumber === undefined ) nowPageNumber = 1;
  if( nowPageNumber == totalPageCount ) return;
  document.location.href = location.href.split("?")[0]+"?p="+(++nowPageNumber);
});

function set_word(sel)
{

  if( sel == "추가" )
  {

    var inputName = document.getElementById("add_word").value;
    var inputSup = document.getElementById("add_sup").value;

    if( !inputName.trim() || !inputSup.trim() )
    {
      return ;
    }

    if(localStorage["word"] == undefined )
    {
      var word_arr = [];
      var word = new Object();
      word.id = 1;
      word.name = inputName;
      word.sup = inputSup;
      word_arr.push(word);
      localStorage["word"]=JSON.stringify(word_arr);
      localStorage["id"]=2;
    }
    else
    {
      var word_arr = JSON.parse(localStorage["word"]);
      var word = new Object();
      word.id = localStorage["id"];
      word.name = inputName;
      word.sup = inputSup;
      word_arr.push(word);
      localStorage["word"]=JSON.stringify(word_arr);
      localStorage["id"]++;
    }


  }
  else if( sel.value == "제거" )
  {
    var word_arr = JSON.parse(localStorage["word"]);
    for(var i = 0; i < word_arr.length; i++ )
    {
      if( word_arr[i].name == sel.name && word_arr[i].id == sel.id )
      {
        word_arr.splice(i,1);
        for(var j = i; j < word_arr.length; j++ )
        {
          word_arr[j].id=word_arr[j].id-1;
        }
        localStorage["word"]=JSON.stringify(word_arr);
        localStorage["id"]--;
      }
    }
  }
  else
  {

    var word_arr = JSON.parse(localStorage["word"]);
    var tag = "<input type='text' placeholder='수정할 단어 입력' id='up_word'/>"+
    "<input type='text' placeholder='설명 입력' id='up_word_sup'/>";
    var tag2 = $("<input type='button' value='확인' id='updateBtn'/>");
    tag2.click(function()
    {
      var updateWord = document.getElementById("up_word").value;
      var updateWordSup = document.getElementById("up_word_sup").value;
      if( !updateWord.trim() || !updateWordSup.trim() )
      {
        $(".up_error").remove();
        $(".sup_error").remove();
        if(!updateWord.trim()) $("#up_word").after("<p class='up_error'>값을 입력해주세요</p>");
        if(!updateWordSup.trim()) $("#up_word_sup").after("<p class='sup_error'>값을 입력해주세요</p>");
        return 0;
      }
      for(var i = 0; i < word_arr.length; i++ )
      {
        if( word_arr[i].id == sel.id )
        {
          word_arr[i].name = updateWord;
          word_arr[i].sup = updateWordSup;
          localStorage["word"] = JSON.stringify(word_arr);
        }
      }

    });
    var tag3 = $("<input type='button' value='취소' id='cancleBtn'/>");
    tag3.click(function()
    {
      $("#up_word").remove();
      $("#up_word_sup").remove();
      $("#updateBtn").remove();
      $("#cancleBtn").remove();
    });
    $(sel).after(tag,tag2,tag3);

  }
}
