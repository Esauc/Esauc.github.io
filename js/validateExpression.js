

//Pega os dados inseridos na caixa pelo usuário, valida e envia para o texto txtFx
//Só será plotado no canvas a função que corresponde ao texto txtFx
function getInputExpression()
{
	var caixaDeEntrada = document.getElementById("caixaDeEntrada");
    var texto = document.getElementById("txtFx");

    var exp = caixaDeEntrada.value;
    var expressao = validateExpression(caixaDeEntrada.value);

    if(expressao.length > 0)
    {
    	if(plotFunction(expressao))
    	{
    		texto.textContent = "f(x) = " + exp;
    	}
    	else
    	{
    		alert("Erro 2: Não foi possível calcular sua função.")
    	}
    }
    else
    {
    	caixaDeEntrada.value = "";
    	alert("Erro 1: Expressão inválida, você informou caracteres não reconhecidos.");
    }
}

function getDerivative()
{
	var caixaDeEntrada = document.getElementById("caixaDeEntrada");
    var texto = document.getElementById("txtFx");
    var exp = caixaDeEntrada.value;
    var expressao = validateExpression(caixaDeEntrada.value);

    var caixaX = document.getElementById("caixaDeEntradaX");
    var textoDerivada = document.getElementById("txtDerivada");

    if(("" + caixaX.value).length > 0)
    {
    	if(expressao.length > 0)
    	{
	    	if(plotFunction(expressao))
	    	{
	    		//Definição de derivada:
	    		// f '(x) = lim (f(x + h) -f(x)) / h  ... Para h->0
	    		var derivada;

	    		try
	    		{
	    			var x = caixaX.value;
	    			x -= 1.0;
	    			x += 1.0;

	    			derivada = calculateDerivative(x);
	    			textoDerivada.textContent = "f '(" + caixaX.value + ") = " + derivada.toFixed(4);
	    		}
	    		catch(e)
	    		{
	    			alert("Erro 4: Valor de X inválido!");
	    		}
	    	}
	    	else
	    	{
	    		alert("Erro 2: Não foi possível calcular sua função.")
	    	}
    	}
    	else
    	{
    		caixaDeEntrada.value = "";
    		alert("Erro 1: Expressão inválida, você informou caracteres não reconhecidos.");
    	}
    }
    else
    {
    	alert("Erro 3: Você precisa informar um valor para X!");
    }
}

//Esse algoritmo valida a expressao do usuário, verifica erros ou funções que não correspondem à calculadora
//Evita injeção de código e riscos de segurança
function validateExpression(string)
{
	string = string.replace(/\s+/g, ''); //Remove todos os espaços
	string = string.toLowerCase(); //Tudo para letra minuscula

	numbers = ['0','1','2','3','4','5','6','7','8','9'];
	operators = ['+','-','*','/','^','(',')','.'];
	functions = ['sin', 'cos', 'log'];
	constants = ['PI', 'E', 'x'];

	allowed = [];
	allowed.push(numbers);
	allowed.push(operators);
	allowed.push(functions);
	allowed.push(constants);
	
	//Remove todos os termos permitidos da string
	//Se nao sobrar nada é porque todos os termos da expressao do usuário estão dentro do permitido
	//Se sobrar alguma coisa significa que tem termos inválidos
	var strTest = string;

	for(var i = 0; i < allowed.length; i++)
	{
		var a = allowed[i];

		for(var j = 0; j < a.length; j++)
		{
			//Remove todas as ocorrências

			if(i == 1 & j == 4) //O caractere ^ é especial e não lança exceção se não forem utilizadas as \\
			{
				strTest = strTest.replace(new RegExp("\\" + a[j], "g"), '');
				continue;
			}
			try //Se for um caractere normal, efetua a substituição
			{
				strTest = strTest.replace(new RegExp(a[j], "g"), '');
			}
			catch(e) //Se for um caractere especial, adiciona as \\ para não dar erro
			{
				strTest = strTest.replace(new RegExp("\\" + a[j], "g"), '');
			}
		}
	}

	//Se a string teste está vazia é porque a expressão está OK
	if(strTest.length == 0)
	{
		//Adiciona operador de multiplicação aos coeficientes de X
		for(var i = 0; i < numbers.length; i++)
		{
			string = string.replace(new RegExp("" + numbers[i] + "x", "g"), "" + numbers[i] + "*x");
		}
		string = string.replace(new RegExp("xx", "g"), "x*x"); //Para coeficientes = X
		string = string.replace(new RegExp("xx", "g"), "x*x");

		//Adiciona Math. as funcoes
		for(var i = 0; i < functions.length; i++)
		{
			string = string.replace(new RegExp(functions[i], "g"), ("Math."+functions[i]));
		}

		//Troca o operador ^ por ** (exponenciação)
		string = string.replace(new RegExp("\\^", "g"), "**");

		return string;
	}

	console.log(strTest);
	//Se nao, retorna nada. Expressão inválida
	return "";
}