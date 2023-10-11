namespace HelloBear.Application.Common.Models;

public class MailRequest
{
    public Conversant Sender { get; set; }
    public List<Conversant> Recipients { get; set; }
    public string Subject { get; set; }
    public string Body { get; set; }
}

public class Conversant
{
    public Conversant(string address, string name = null)
    {
        Address = address;
        Name = name;
    }

    public string Name { get; set; }
    public string Address { get; set; }
}
