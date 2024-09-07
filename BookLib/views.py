from django.shortcuts import render
from django.http import JsonResponse
from .models import Books

def index(request):
    if request.method == 'POST':
        title = request.POST.get('title')
        author = request.POST.get('author')
        description = request.POST.get('des')
        
        # Create a new book entry
        book = Books.objects.create(title=title, author=author, des=description)
        
        # Return JSON response with multiple attributes
        return JsonResponse({
            'success': True,
            'id': book.id,
            'title': book.title,
            'author': book.author,
            'description': book.des
        })
    
    # For GET requests, fetch all books
    books = Books.objects.all()
    return render(request, 'index.html', {'books': books})

def delete_book(request, id):
    if request.method == 'DELETE':
        try:
            book = Books.objects.get(id=id)
            book.delete()
            return JsonResponse({'success': True})
        except Books.DoesNotExist:
            return JsonResponse({'success': False}, status=404)
    return JsonResponse({'success': False}, status=400)
