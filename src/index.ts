(async function(){
      const response = await fetch("https://api.github.com",{
            method: "GET",
      });
      const data = await response.json();
      // console.log(data);

      const testeMap = [data].map((item) => item.keys_url);
      console.log(testeMap);
}
)();
