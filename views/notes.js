<head>
    <link rel="stylesheet" type="text/css" href="/css/showcart.css">
</head>
<h1 class="space">Your Shopping Cart</h1>
<script>
    function update(newid, newqty) {
        window.location = "showcart?update=" + newid + "&newqty=" + newqty;
    }
</script>

{{#if product}}
    <div>
        <form name="form1">
            <table class="table table-container">
                <tr>
                    <th scope="col">Product Id</th>
                    <th scope="col">Product Name</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Price</th>
                    <th scope="col">Subtotal</th>
                </tr>
                {{#each product}}
                    {{#if this}}
                        <tr>
                            <td>{{this.id}}</td>
                            <td>{{this.name}}</td>
                            <td><label>
                                <input type='number' min='1' step='1' oninput="validity.valid||(value='');"
                                       id='newqty{{this.id}}' value={{this.quantity}}>
                            </label></td>
                            <td>${{this.price}}</td>
                            <td>${{subtotal this.price this.quantity}}</td>
                            <td><a href='\showcart?delete={{this.id}}'>Remove Item from Cart</a></td>
                            <td><input type=button onclick="update({{this.id}}, document.form1.newqty{{this.id}}.value)"
                                     class="btn button-coloured"  value="Update Quantity"></td>
                        </tr>
                    {{/if}}
                {{/each}}
                <tr>
                    <td colspan=\"4\" align=\"right\"><b>Order Total</b></td>
                    <td align=\"right\">${{ordertotal product}}</td>
                </tr>
            </table>
        </form>
    </div>
    <h2 class="space"><a href="checkout">Check Out</a></h2>
{{else}}
    <h1 class="space">Your shopping cart is empty!</h1>
{{/if}}
<h2 class="space"><a href="listprod">Continue Shopping</a></h2>